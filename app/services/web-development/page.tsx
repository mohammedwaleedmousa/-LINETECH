import ServiceDetail from "../ServiceDetail";

export const metadata = {
  title: "Web Development",
  description: "Web development services from LINETECH for fast, clear and scalable websites and web products.",
};

export default function WebDevelopmentPage(){
  return <ServiceDetail
    className="service-web"
    eyebrow="WEB DEVELOPMENT"
    title="Web products built to perform."
    lead="From focused company websites to custom web applications, we shape the experience around the business goal, then build it for speed, clarity and long-term use."
    serviceParam="Web Development"
    visualWords={["FAST","CLEAR","RESPONSIVE","SCALABLE"]}
    deliverables={[
      ["Product structure","A clear page and feature structure before development starts."],
      ["Responsive interface","A polished experience designed to work across desktop, tablet and mobile."],
      ["Development","Clean implementation focused on performance, usability and maintainability."],
      ["Launch readiness","Testing, deployment preparation and a clear handover for the next step."],
    ]}
    fits={[
      ["Companies","A professional digital presence that explains the business clearly and converts interest into action."],
      ["New products","A strong first version for an idea that needs to become a usable web product."],
      ["Existing platforms","A clearer, faster or more structured experience for a website that has outgrown its current form."],
    ]}
    process={[
      ["Understand","We define the audience, goal and the real job the website needs to do."],
      ["Structure","We shape pages, flows and priorities before visual design begins."],
      ["Build","We develop, refine and test the experience across the required screens."],
      ["Launch","We prepare deployment, final checks and the handover for ongoing use."],
    ]}
  />;
}
