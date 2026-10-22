import ModulePage from "../../ModulePage";
export const metadata={title:"My companies",robots:{index:false,follow:false}};
export default function Page(){return <ModulePage title={["شركاتي", "My companies"]} description={["حساب شخصي واحد يمكنه الانضمام إلى عدة شركات مستقلة. لا توجد عضويات شركات مفعلة في هذه النسخة.", "One personal account can belong to multiple independent companies. Company memberships are not enabled in this version."]} href="/company-space/request"/>;}
