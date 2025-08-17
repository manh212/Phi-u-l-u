
import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../hooks/useGame';
import OffCanvasPanel from '../ui/OffCanvasPanel';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import { GameMessage } from '../../types';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';

interface AICopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICopilotPanel: React.FC<AICopilotPanelProps> = ({ isOpen, onClose }) => {
  const {
    handleCopilotQuery,
    aiCopilotMessages,
    isLoadingApi,
    sentPromptsLog, // Get sentPromptsLog from context
  } = useGame();

  const [userInput, setUserInput] = useState('');
  const [showLastPromptModal, setShowLastPromptModal] = useState(false); // New state for modal

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiCopilotMessages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleCopilotQuery(userInput.trim());
      setUserInput('');
    }
  };

  const handleQuickAction = (question: string, context?: string) => {
    handleCopilotQuery(question, context);
  };

  return (
    <>
      <OffCanvasPanel
        isOpen={isOpen}
        onClose={onClose}
        title="Siêu Trợ Lý AI"
        position="right"
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-4">
            {(aiCopilotMessages || []).map((msg, index) => (
              <div key={msg.id || index} className={`flex ${msg.isPlayerInput ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.type === 'error' ? 'bg-red-800 text-red-100' : (msg.isPlayerInput ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200')}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoadingApi && (
                <div className="flex justify-start">
                     <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-gray-700 text-gray-200">
                        <Spinner size="sm" text="AI đang phân tích..."/>
                     </div>
                </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex-shrink-0 p-2 border-t border-gray-700 space-y-2">
             <div className="grid grid-cols-2 gap-2 text-xs">
                <Button variant="ghost" size="sm" onClick={() => handleQuickAction("Tôi nên làm gì tiếp theo?")} disabled={isLoadingApi}>💡 Cần Gợi Ý</Button>
                <Button variant="ghost" size="sm" onClick={() => handleQuickAction("Tóm tắt tình hình hiện tại.")} disabled={isLoadingApi}>📚 Tóm Tắt</Button>
                <Button variant="ghost" size="sm" onClick={() => handleQuickAction("Phân tích các lựa chọn của tôi.")} disabled={isLoadingApi}>🔍 Phân Tích</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowLastPromptModal(true)} disabled={isLoadingApi || sentPromptsLog.length === 0}>📝 Xem Prompt Gần Nhất</Button>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Hỏi AI điều gì đó..."
                className="flex-grow p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-indigo-500 text-white placeholder-gray-400 resize-none text-sm"
                rows={2}
                disabled={isLoadingApi}
              />
              <Button type="submit" disabled={isLoadingApi || !userInput.trim()}>Gửi</Button>
            </form>
          </div>
        </div>
      </OffCanvasPanel>
      
      {showLastPromptModal && (
        <Modal
            isOpen={showLastPromptModal}
            onClose={() => setShowLastPromptModal(false)}
            title="Prompt Gần Nhất Gửi Cho AI Kể Chuyện"
        >
            <pre className="whitespace-pre-wrap break-all bg-gray-700 p-3 rounded-md text-xs text-gray-200 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {sentPromptsLog[0] || "Chưa có prompt nào được gửi đi."}
            </pre>
        </Modal>
      )}
    </>
  );
};

export default AICopilotPanel;