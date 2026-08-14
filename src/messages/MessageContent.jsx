import ChapterCommentMessage from "./renders/ChapterCommentMessage";
import CommentRepliedMessage from "./renders/CommentRepliedMessage";
import DeletionMessage from "./renders/DeletionMessage";
import SystemMessage from "./renders/SystemMessage";
import UpdateRoleRequestMessage from "./renders/UpdateRoleRequestMessage";
import UserMessage from "./renders/UserMessge";

const messageRenderers = {
  SYSTEM: SystemMessage,
  USER: UserMessage,
  CHAPTER_COMMENT: ChapterCommentMessage,
  COMMENT_REPLIED: CommentRepliedMessage,
  UPDATE_ROLE_REQUEST: UpdateRoleRequestMessage,
  DELETION: DeletionMessage,
};

const MessageContent = ({ message }) => {
  const Renderer = messageRenderers[message.type];

  if (!Renderer) {
    return <p>{message.messageContent}</p>;
  }

  return <Renderer message={message} />;
};

export default MessageContent;
