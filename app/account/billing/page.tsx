import ModulePage from "../../ModulePage";
export const metadata={title:"Invoices & payments",robots:{index:false,follow:false}};
export default function Page(){return <ModulePage title={["الفواتير والمدفوعات", "Invoices & payments"]} description={["ستظهر الفواتير وسجلات الدفع المؤكدة هنا بعد ربط نظام التحصيل.", "Confirmed invoices and payment records will appear here after billing integration."]} href="/account/subscriptions"/>;}
