import { useParams } from 'react-router-dom';
import { ChatWindow } from '../../components/chat-interface/chatExport';

export default function Chat() {
  const { id } = useParams();
  return <ChatWindow key={id} />;
}
