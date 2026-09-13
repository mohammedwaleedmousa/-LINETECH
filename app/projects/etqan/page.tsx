import ProjectDetail from "../ProjectDetail";

export const metadata = {
  title: "Etqan",
  description: "Etqan case study — a services marketplace structured around discovery, trust, categories and scalable operations.",
};

export default function EtqanPage(){
  return <ProjectDetail
    className="project-etqan"
    tag="SERVICES MARKETPLACE"
    title="Etqan"
    lead="A services marketplace designed to make finding, comparing and requesting local services clearer for customers and easier to manage operationally."
    summary="Etqan organizes providers, categories and service requests into one marketplace experience, with the structure needed to support both customer discovery and platform administration."
    challenge="A services marketplace has to make many providers and categories feel simple, while still creating enough structure for trust, discovery and future growth."
    approach="The product was shaped around clear categories, provider visibility, focused customer journeys and an admin structure that can support the marketplace as it expands."
    built={[
      ["Service discovery","Category-driven browsing that helps customers move from a need to relevant providers."],
      ["Provider structure","A consistent way to present service providers, details and the information customers need."],
      ["Customer journey","Flows for discovering, reviewing and moving toward a service request with less confusion."],
      ["Admin operations","Management areas for marketplace content, providers, customers and platform structure."],
    ]}
    stack={["React + Vite","Tailwind CSS","Supabase","Cloudflare"]}
    visualWords={["SERVICES","DISCOVERY","TRUST","MARKETPLACE"]}
  />;
}
