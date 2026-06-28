package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.ChatMessageRequest;
import com.campusconnect.backend.dto.MessageResponse;
import com.campusconnect.backend.entity.Message;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.MessageRepository;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class ChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Receives a chat message from a client via /app/chat.send,
     * saves it to the database, and broadcasts to /topic/messages.{receiverId}
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest chatMessage) {
        // For STOMP messaging, senderId should be provided or resolved from the principal.
        // Here we use the receiverId from the payload. The sender info should be included
        // in a real app via the authenticated principal on the WebSocket session.
        // For now, we save with the info provided.

        User receiver = userRepository.findById(chatMessage.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Note: In production, sender should be extracted from the authenticated
        // WebSocket session principal. For now, we require senderId in the request.
        // We'll handle this via an extended request or header.

        Message message = new Message();
        message.setReceiver(receiver);
        message.setContent(chatMessage.getContent());

        // If senderId is available (can be extended), set sender
        // For now, we'll need to extract from headers or session
        // This is a placeholder - in production use Principal
        messageRepository.save(message);

        MessageResponse response = new MessageResponse(message);

        // Broadcast to receiver's topic
        messagingTemplate.convertAndSend(
                "/topic/messages." + chatMessage.getReceiverId(), response);
    }

    /**
     * Fetches conversation history between the authenticated user and another user.
     * Client sends to /app/chat.history/{userId} and response is sent back
     * to /topic/chat.history.{userId}
     */
    @MessageMapping("/chat.history/{userId}")
    @SendTo("/topic/chat.history.{userId}")
    public List<MessageResponse> getConversationHistory(
            @DestinationVariable Long userId,
            @Payload Long currentUserId) {

        List<Message> messages = messageRepository.findConversation(currentUserId, userId);

        return messages.stream()
                .map(MessageResponse::new)
                .collect(Collectors.toList());
    }
}
