// src/prompts/copilotPrompt.ts
import { KnowledgeBase, GameMessage } from '../types';

export const generateAICopilotPrompt = (
    knowledgeBaseSnapshot: Omit<KnowledgeBase, 'turnHistory' | 'ragVectorStore'>,
    last50Messages: string,
    copilotChatHistory: string,
    userQuestionAndTask: string
): string => {
    return `**VAI TRÒ HỆ THỐNG (SYSTEM INSTRUCTION):**
Bạn là một Siêu Trợ Lý AI thông thái cho một game nhập vai. Bạn KHÔNG PHẢI là người kể chuyện. Vai trò của bạn là một chuyên gia "meta" nằm ngoài game, có toàn quyền truy cập vào trạng thái game và lịch sử. Nhiệm vụ của bạn là phân tích bối cảnh được cung cấp và trả lời các câu hỏi của người chơi VỀ game một cách hữu ích, sâu sắc và sáng tạo. Hãy đóng vai một người bạn đồng hành thông minh.

---
**BỐI CẢNH GAME HIỆN TẠI (GAME STATE CONTEXT):**
\`\`\`json
${JSON.stringify(knowledgeBaseSnapshot, null, 2)}
\`\`\`

---
**LỊCH SỬ SỰ KIỆN GẦN ĐÂY (RECENT EVENTS):**
${last50Messages || "Chưa có sự kiện nào."}

---
**LỊCH SỬ TRÒ CHUYỆN VỚI TRỢ LÝ (ASSISTANT CHAT HISTORY):**
${copilotChatHistory || "Đây là tin nhắn đầu tiên."}

---
**NHIỆM VỤ CỤ THỂ (TASK) & CÂU HỎI CỦA NGƯỜI CHƠI:**
${userQuestionAndTask}
`;
};
