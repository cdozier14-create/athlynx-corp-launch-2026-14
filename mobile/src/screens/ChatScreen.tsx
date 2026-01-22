import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen({ route }: any) {
  const wizard = route?.params?.wizard || { title: 'AI Assistant', icon: '🤖' };
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hello! I'm your ${wizard.title}. How can I help you today?`, isUser: false, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(wizard.id, input),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>{wizard.icon}</Text>
        <Text style={styles.headerTitle}>{wizard.title}</Text>
        <Text style={styles.poweredBy}>Pure Python & Julia Technology</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.msgBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.msgText, item.isUser && styles.userText]}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#64748b"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function getAIResponse(wizardId: string, userInput: string): string {
  const responses: Record<string, string[]> = {
    agent: [
      "When evaluating agents, look for NFLPA/NBPA certification, transparent fee structures (typically 3-5% for NFL), and a track record with similar athletes.",
      "I recommend interviewing at least 3 agents before making a decision. Ask about their client roster, marketing capabilities, and NIL strategy.",
    ],
    lawyer: [
      "NIL contracts should always include clear deliverables, payment terms, exclusivity clauses, and termination conditions. Never sign without legal review.",
      "Make sure your NIL deals don't conflict with your school's existing sponsorships. Check with your compliance office first.",
    ],
    financial: [
      "As an athlete, I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings/investments. But given the short career window, consider saving more.",
      "Set aside 25-30% of NIL income for taxes. Consider working with a CPA who specializes in athlete finances.",
    ],
    default: [
      "That's a great question! Let me help you think through this step by step.",
      "I'm here to guide you through this process. What specific aspect would you like to explore further?",
    ]
  };
  
  const wizardResponses = responses[wizardId] || responses.default;
  return wizardResponses[Math.floor(Math.random() * wizardResponses.length)];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 16, backgroundColor: '#1e293b', alignItems: 'center' },
  headerIcon: { fontSize: 32 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  poweredBy: { fontSize: 10, color: '#a855f7', marginTop: 4 },
  messageList: { padding: 16 },
  msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#22d3ee' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#1e293b' },
  msgText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  userText: { color: '#0f172a' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#1e293b' },
  input: { flex: 1, backgroundColor: '#0f172a', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 16 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#22d3ee', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendIcon: { fontSize: 20, color: '#0f172a' },
});
