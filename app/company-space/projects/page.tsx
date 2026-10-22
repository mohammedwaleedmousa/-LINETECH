import ModulePage from "../../ModulePage";
export const metadata={title:"Company projects",robots:{index:false,follow:false}};
export default function Page(){return <ModulePage title={["مشاريع الشركة", "Company projects"]} description={["لن تُعرض مشاريع الحساب الشخصي هنا؛ تعرض هذه المساحة مشاريع الشركة المصرّح بها بعد تفعيل العزل.", "Personal account projects are not shown here. Authorized company projects will appear after tenant isolation is enabled."]} href="/company-space"/>;}
