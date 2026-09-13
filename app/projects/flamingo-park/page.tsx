import ProjectDetail from "../ProjectDetail";

export const metadata = {
  title: "Flamingo Park",
  description: "Flamingo Park case study — a mobile-first commerce platform focused on product discovery, ordering and store operations.",
};

export default function FlamingoParkPage(){
  return <ProjectDetail
    className="project-flamingo"
    tag="E-COMMERCE"
    title="Flamingo Park"
    lead="A mobile-first commerce experience built around product discovery, faster ordering and a clearer operational flow for the store."
    summary="Flamingo Park brings the catalog, product detail, filtering, ordering and store management into one focused digital experience designed for customers using mobile first."
    challenge="The product needed to make a large catalog easier to browse while reducing friction around product choices, orders and the operational work behind them."
    approach="The experience was structured around fast discovery, clear product information, responsive interaction and an admin flow that keeps catalog and order work manageable."
    built={[
      ["Catalog & discovery","Categories, brands, filtering and product browsing structured for a growing catalog."],
      ["Product experience","Product detail flows for images, sizes, colors, availability and purchase actions."],
      ["Order journey","A clearer path from product selection to order confirmation and customer follow-up."],
      ["Store operations","Admin tools for products, content, customers, orders and store configuration."],
    ]}
    stack={["React + Vite","Tailwind CSS","Supabase","Cloudflare Pages"]}
    visualWords={["DISCOVERY","COMMERCE","ORDERS","OPERATIONS"]}
  />;
}
