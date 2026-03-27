const PROFILE_COLLECTION_NAME = 'deskaroo_profile';
const PROFILE_FILE_FIELD = 'profile_picture';
const MAX_PROFILE_PICTURE_SIZE_BYTES = 5 * 1024 * 1024;

type PocketBaseFileRecord = {
  id: string;
  collectionName?: string;
  [PROFILE_FILE_FIELD]?: string | string[] | null;
};

const firstDefined = (...values: Array<string | undefined>) => {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();
};

const getPocketBaseBaseUrl = () => {
  const baseUrl = firstDefined(
    process.env.POCKETBASE_URL,
    process.env.NEXT_PUBLIC_POCKETBASE_URL
  );

  if (!baseUrl) {
    throw new Error(
      'PocketBase is not configured. Set POCKETBASE_URL (or NEXT_PUBLIC_POCKETBASE_URL).'
    );
  }

  return baseUrl.replace(/\/+$/, '');
};

const getPocketBaseErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as {
      message?: string;
      error?: string;
    };

    return data.message ?? data.error ?? fallback;
  } catch {
    const text = await response.text();
    return text || fallback;
  }
};

const getPocketBaseAuthToken = async (baseUrl: string) => {
  const token = firstDefined(
    process.env.POCKETBASE_AUTH_TOKEN,
    process.env.POCKETBASE_SUPERUSER_TOKEN
  );

  if (token) {
    return token;
  }

  const identity = firstDefined(
    process.env.POCKETBASE_SUPERUSER_EMAIL,
    process.env.POCKETBASE_ADMIN_EMAIL
  );
  const password = firstDefined(
    process.env.POCKETBASE_SUPERUSER_PASSWORD,
    process.env.POCKETBASE_ADMIN_PASSWORD
  );

  if (!identity || !password) {
    throw new Error(
      'PocketBase auth is not configured. Set POCKETBASE_AUTH_TOKEN or POCKETBASE_SUPERUSER_EMAIL and POCKETBASE_SUPERUSER_PASSWORD.'
    );
  }

  const response = await fetch(`${baseUrl}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identity,
      password,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await getPocketBaseErrorMessage(response, 'Unable to authenticate with PocketBase.'));
  }

  const data = (await response.json()) as {
    token?: string;
  };

  if (!data.token) {
    throw new Error('PocketBase auth did not return a token.');
  }

  return data.token;
};

const createUploadFormData = (file: File) => {
  const formData = new FormData();
  formData.append(PROFILE_FILE_FIELD, file, file.name);
  return formData;
};

const getUploadedFileName = (record: PocketBaseFileRecord) => {
  const fileValue = record[PROFILE_FILE_FIELD];

  if (Array.isArray(fileValue)) {
    return fileValue[0] ?? null;
  }

  if (typeof fileValue === 'string' && fileValue.length > 0) {
    return fileValue;
  }

  return null;
};

const buildFileUrl = (baseUrl: string, recordId: string, fileName: string) => {
  return new URL(
    `/api/files/${PROFILE_COLLECTION_NAME}/${recordId}/${encodeURIComponent(fileName)}`,
    `${baseUrl}/`
  ).toString();
};

const parseExistingProfileUpload = (avatarUrl: string | null | undefined, baseUrl: string) => {
  if (!avatarUrl) {
    return null;
  }

  try {
    const avatar = new URL(avatarUrl);
    const pocketBase = new URL(baseUrl);
    const expectedPrefix = `/api/files/${PROFILE_COLLECTION_NAME}/`;

    if (avatar.origin !== pocketBase.origin || !avatar.pathname.startsWith(expectedPrefix)) {
      return null;
    }

    const pathRemainder = avatar.pathname.slice(expectedPrefix.length);
    const [recordId] = pathRemainder.split('/');

    return recordId ? { recordId } : null;
  } catch {
    return null;
  }
};

const saveProfilePictureRecord = async ({
  baseUrl,
  authToken,
  recordId,
  file,
}: {
  baseUrl: string;
  authToken: string;
  recordId?: string;
  file: File;
}) => {
  const endpoint = recordId
    ? `${baseUrl}/api/collections/${PROFILE_COLLECTION_NAME}/records/${recordId}`
    : `${baseUrl}/api/collections/${PROFILE_COLLECTION_NAME}/records`;

  const response = await fetch(endpoint, {
    method: recordId ? 'PATCH' : 'POST',
    headers: {
      Authorization: authToken,
    },
    body: createUploadFormData(file),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      await getPocketBaseErrorMessage(
        response,
        recordId
          ? 'Unable to update the profile image in PocketBase.'
          : 'Unable to upload the profile image to PocketBase.'
      )
    );
  }

  return response.json() as Promise<PocketBaseFileRecord>;
};

export const getMaxProfilePictureSizeBytes = () => MAX_PROFILE_PICTURE_SIZE_BYTES;

export const uploadProfilePictureToPocketBase = async ({
  currentAvatarUrl,
  file,
}: {
  currentAvatarUrl?: string | null;
  file: File;
}) => {
  const baseUrl = getPocketBaseBaseUrl();
  const authToken = await getPocketBaseAuthToken(baseUrl);
  const existingUpload = parseExistingProfileUpload(currentAvatarUrl, baseUrl);

  let record: PocketBaseFileRecord;

  if (existingUpload?.recordId) {
    try {
      record = await saveProfilePictureRecord({
        baseUrl,
        authToken,
        recordId: existingUpload.recordId,
        file,
      });
    } catch {
      record = await saveProfilePictureRecord({
        baseUrl,
        authToken,
        file,
      });
    }
  } else {
    record = await saveProfilePictureRecord({
      baseUrl,
      authToken,
      file,
    });
  }

  const fileName = getUploadedFileName(record);

  if (!fileName) {
    throw new Error('PocketBase did not return the uploaded profile picture.');
  }

  return buildFileUrl(baseUrl, record.id, fileName);
};
