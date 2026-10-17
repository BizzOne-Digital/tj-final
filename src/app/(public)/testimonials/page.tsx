import { InnerPage } from "@/components/public/InnerPage";
import { TESTIMONIALS_BLURB } from "@/lib/league-copy";

export default function TestimonialsPage() {
  return (
    <InnerPage title="Select Families Speak" subtitle="Stories from our Select League family">
      <div dangerouslySetInnerHTML={{ __html: TESTIMONIALS_BLURB }} />
    </InnerPage>
  );
}
