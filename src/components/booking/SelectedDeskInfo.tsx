
import { motion } from 'framer-motion';
import { Desk } from '@/types';
import { getDeskById, getRoomById } from '@/utils';
import DeskUtilitiesList from '@/components/icons/DeskUtilities';

interface SelectedDeskInfoProps {
  selectedDesk: string | null;
  desks: Desk[];
}

const SelectedDeskInfo = ({ selectedDesk, desks }: SelectedDeskInfoProps) => {
  if (!selectedDesk) return null;
  
  const desk = getDeskById(selectedDesk);
  
  if (!desk) return null;
  
  const room = getRoomById(desk.roomId);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
    >
      <h3 className="text-sm font-medium text-blue-800 mb-2">Selected Desk</h3>
      <div className="flex items-start space-x-3">
        <div className="desk-selected w-12 h-8 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium">
            {desk.name}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium">
            {desk.name} 
            {desk.type && <span className="ml-1 text-xs text-gray-600">({desk.type})</span>}
          </p>
          <p className="text-xs text-gray-500">
            {room?.name}
          </p>
          
          {desk.utilities && desk.utilities.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-1">Utilities:</p>
              <DeskUtilitiesList utilities={desk.utilities} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SelectedDeskInfo;
