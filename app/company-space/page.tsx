import ModulePage from "../ModulePage";
export const metadata={title:"Company workspace",robots:{index:false,follow:false}};
export default function Page(){return <ModulePage title={["مساحة الشركة", "Company workspace"]} description={["مساحة مستقلة لكل شركة، تُفتح للأعضاء المصرّح لهم بعد اعتماد الطلب وتفعيل عزل البيانات.", "An independent workspace for each company, available to authorized members after approval and tenant isolation are enabled."]} href="/account/companies"/>;}
