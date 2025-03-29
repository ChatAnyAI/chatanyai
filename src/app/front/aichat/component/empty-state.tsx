import { MessageSquare } from "lucide-react"
import { useTranslation } from 'react-i18next';

export function EmptyState() {
  const { t } = useTranslation();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <MessageSquare className="text-gray-400" size={24} />
      </div>
      <h3 className="text-xl font-medium mb-2">{t('empty-state.No Chats')}</h3>
      <p className="text-gray-500">{t('empty-state.To get started, create a new chat in this project.')}</p>
    </div>
  )
}