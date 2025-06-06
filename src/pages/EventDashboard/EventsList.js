// import React from 'react';
//
// export const EventsList = ({ events, loading, onSelectEvent }) => {
//     const formatEventDate = (timestamp) => {
//         if (!timestamp) return 'Unknown date';
//         const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//         return date.toLocaleDateString();
//     };
//
//     return (
//         <div className="text-center text-white mb-4">
//             <DashboardHeader
//                 title="My Events Dashboard"
//                 subtitle="Select an event to view its messages"
//             />
//
//             {loading ? (
//                 <LoadingSpinner message="Loading Events..." />
//             ) : events.length === 0 ? (
//                 <EmptyState
//                     icon="bi-calendar-x"
//                     title="No Events Yet"
//                     message="Create your first event to get started."
//                 />
//             ) : (
//                 <div className="row">
//                     <div className="col-12 col-lg-10 mx-auto">
//                         <div className="row g-3">
//                             {events.map((event) => (
//                                 <EventCard
//                                     key={event.id}
//                                     event={event}
//                                     onSelect={() => onSelectEvent(event.id)}
//                                     formatDate={formatEventDate}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };