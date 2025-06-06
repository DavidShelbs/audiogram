// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { httpsCallable } from 'firebase/functions';
// import { functions } from '../../Firebase';
// import { NavBar, useAuth } from '../../components';
// import { EventsList, EventMessages } from '../../pages';
//
// export const EventDashboardTest = () => {
//     const [events, setEvents] = useState([]);
//     const [eventsLoading, setEventsLoading] = useState(true);
//     const [searchParams, setSearchParams] = useParams();
//     const { user, loading } = useAuth();
//
//     const eventId = searchParams.get('eventId');
//     const currentView = eventId ? 'messages' : 'events';
//
//     useEffect(() => {
//         if (user && !eventId) {
//             loadUserEvents();
//         }
//     }, [user, eventId]);
//
//     const loadUserEvents = async () => {
//         setEventsLoading(true);
//         try {
//             const getUserEventsFn = httpsCallable(functions, 'getUserEvents');
//             const result = await getUserEventsFn();
//             if (result.data.success) {
//                 setEvents(result.data.events);
//             }
//         } catch (error) {
//             console.error('Error loading events:', error);
//         } finally {
//             setEventsLoading(false);
//         }
//     };
//
//     const selectEvent = (selectedEventId) => {
//         setSearchParams({ eventId: selectedEventId });
//     };
//
//     const backToEvents = () => {
//         setSearchParams({});
//     };
//
//     if (loading) {
//         return <LoadingSpinner message="Loading..." />;
//     }
//
//     return (
//         <>
//             <NavBar />
//             <DashboardLayout>
//                 {currentView === 'events' ? (
//                     <EventsList
//                         events={events}
//                         loading={eventsLoading}
//                         onSelectEvent={selectEvent}
//                     />
//                 ) : (
//                     <EventMessages
//                         eventId={eventId}
//                         onBack={backToEvents}
//                     />
//                 )}
//             </DashboardLayout>
//         </>
//     );
// };