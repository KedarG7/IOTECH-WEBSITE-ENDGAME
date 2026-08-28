import EventDetailsClient from "./EventDetailsClient";

export async function generateMetadata() {
  return { title: "Event Details | IOTECH Club" };
}

export default function EventDetailsPage({ params }) {
  return <EventDetailsClient slug={params.slug} />;
}
