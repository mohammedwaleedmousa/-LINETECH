import ModulePage from "../../ModulePage";
export const metadata={title:"My companies",robots:{index:false,follow:false}};
export default function Page(){return <ModulePage title={["شركاتي", "My companies"]} description={["حساب واحد لمساحات أعمال متعددة. هنا ستجد الشركات التي تنضم إليها ودعوات العضوية.", "One account for multiple workspaces. Find your companies and membership invitations here."]} href="/company-space/request"/>;}
