import EventsClient from "./EventsClient";

export const metadata = {
  title: "Events | IOTECH Club",
  description: "Discover upcoming workshops, hackathons, and tech events hosted by IOTECH.",
};

export default function EventsPage() {
  return <EventsClient />;
}
