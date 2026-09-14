import { redirect } from "next/navigation";

export const metadata = {
  title: "Start Your Line",
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect("/start#brief");
}
