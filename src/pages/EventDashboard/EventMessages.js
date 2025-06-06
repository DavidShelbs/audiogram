// import React, { useState, useRef, useEffect } from 'react';
// import { httpsCallable } from 'firebase/functions';
// import { deleteDoc, doc } from 'firebase/firestore';
// import { functions, firestore } from '../../Firebase';
// import { Waveform } from '../../components';
//
// export const EventMessages = ({ eventId, onBack }) => {
//     const [messages, setMessages] = useState([]);
//     const [messagesLoading, setMessagesLoading] = useState(false);
//     const [eventName, setEventName] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('newest');
//     const [selectedMessages, setSelectedMessages] = useState(new Set());
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//
//     useEffect(() => {
//         if (eventId) {
//             loadMessages(eventId);
//         }
//     }, [eventId]);
//
//     const loadMessages = async (eventIdToLoad) => {
//         setMessagesLoading(true);
//         try {
//             const loadMessagesFn = httpsCallable(functions, 'loadMessagesForEvent');
//             const result = await loadMessagesFn({ eventId: eventIdToLoad });
//             if (result.data.success) {
//                 setMessages(result.data.messages);
//                 setEventName(result.data.eventName);
//             }
//         } catch (error) {
//             console.error('Error loading messages:', error);
//         } finally {
//             setMessagesLoading(false);
//         }
//     };
//
//     const selectEvent = (selectedEventId, selectedEventName) => {
//         setEventId(selectedEventId);
//         setEventName(selectedEventName);
//         setCurrentView('messages');
//
//         // Update URL parameters
//         const newUrl = new URL(window.location);
//         newUrl.searchParams.set('eventId', selectedEventId);
//         window.history.pushState({}, '', newUrl);
//
//         loadMessages(selectedEventId);
//     };
//
//     const backToEvents = () => {
//         setCurrentView('events');
//         setEventId('');
//         setEventName('');
//         setMessages([]);
//         setSelectedMessages(new Set());
//
//         // Remove event ID from URL
//         const newUrl = new URL(window.location);
//         newUrl.searchParams.delete('eventId');
//         newUrl.searchParams.delete('event');
//         window.history.pushState({}, '', newUrl);
//     };
//
//     const formatDate = (timestamp) => {
//         if (!timestamp) return 'Unknown date';
//         const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//         return date.toLocaleString();
//     };
//
//     const formatEventDate = (timestamp) => {
//         if (!timestamp) return 'Unknown date';
//         const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//         return date.toLocaleDateString();
//     };
//
//     const playAudio = (messageId) => {
//         const audioToPlay = audioRefs.current[messageId];
//
//         if (!audioToPlay) return;
//
//         // If the same audio is playing, stop it
//         if (playingId === messageId) {
//             audioToPlay.pause();
//             audioToPlay.currentTime = 0;
//             setPlayingId(null);
//             return;
//         }
//
//         // Stop all other audio
//         Object.keys(audioRefs.current).forEach(id => {
//             const ref = audioRefs.current[id];
//             if (ref && id !== messageId) {
//                 ref.pause();
//                 ref.currentTime = 0;
//             }
//         });
//
//         // Now play the new audio
//         audioToPlay.play()
//             .then(() => {
//                 setPlayingId(messageId);
//             })
//             .catch((err) => {
//                 console.error("Failed to play audio:", err);
//             });
//     };
//
//     const formatTime = (seconds) => {
//         if (!seconds) return '0:00';
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins}:${secs.toString().padStart(2, '0')}`;
//     };
//
//     const filteredMessages = messages.filter(message =>
//         message.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         message.message?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     const sortedMessages = [...filteredMessages].sort((a, b) => {
//         switch (sortBy) {
//             case 'oldest':
//                 return (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0);
//             case 'name':
//                 return (a.senderName || '').localeCompare(b.senderName || '');
//             case 'duration':
//                 return (b.recordingDuration || 0) - (a.recordingDuration || 0);
//             default: // newest
//                 return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
//         }
//     });
//
//     const toggleSelectMessage = (messageId) => {
//         const newSelected = new Set(selectedMessages);
//         if (newSelected.has(messageId)) {
//             newSelected.delete(messageId);
//         } else {
//             newSelected.add(messageId);
//         }
//         setSelectedMessages(newSelected);
//     };
//
//     const selectAllMessages = () => {
//         if (selectedMessages.size === sortedMessages.length) {
//             setSelectedMessages(new Set());
//         } else {
//             setSelectedMessages(new Set(sortedMessages.map(m => m.id)));
//         }
//     };
//
//     const deleteSelectedMessages = async () => {
//         try {
//             const deletePromises = Array.from(selectedMessages).map(messageId =>
//                 deleteDoc(doc(firestore, 'audioMessages', messageId))
//             );
//
//             await Promise.all(deletePromises);
//             setSelectedMessages(new Set());
//             setShowDeleteConfirm(false);
//         } catch (error) {
//             console.error('Error deleting messages:', error);
//             alert('Failed to delete messages. Please try again.');
//         }
//     };
//
//     const downloadAudio = (audioUrl, senderName, timestamp) => {
//         const link = document.createElement('a');
//         link.href = audioUrl;
//         link.download = `${senderName}_${timestamp}_message.audio`;
//         link.target = '_blank';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
//
//     if (messagesLoading) {
//         return <LoadingSpinner message="Loading Messages..." />;
//     }
//
//     return (
//         <div>
//             <BackButton onClick={onBack} />
//             <DashboardHeader
//                 title="Event Messages Dashboard"
//                 subtitle={`Event: ${eventName}`}
//                 badge={`${messages.length} ${messages.length === 1 ? 'Message' : 'Messages'}`}
//             />
//
//             {messages.length > 0 && (
//                 <MessageControls
//                     searchTerm={searchTerm}
//                     onSearchChange={setSearchTerm}
//                     sortBy={sortBy}
//                     onSortChange={setSortBy}
//                     selectedCount={selectedMessages.size}
//                     onSelectAll={() => {/* logic */}}
//                     onDeleteSelected={() => setShowDeleteConfirm(true)}
//                 />
//             )}
//
//             <MessagesList
//                 messages={sortedMessages}
//                 selectedMessages={selectedMessages}
//                 onToggleSelect={toggleSelectMessage}
//                 onDeleteSingle={(messageId) => {
//                     setSelectedMessages(new Set([messageId]));
//                     setShowDeleteConfirm(true);
//                 }}
//             />
//
//             {showDeleteConfirm && (
//                 <DeleteConfirmModal
//                     count={selectedMessages.size}
//                     onConfirm={deleteSelectedMessages}
//                     onCancel={() => setShowDeleteConfirm(false)}
//                 />
//             )}
//         </div>
//     );
// };