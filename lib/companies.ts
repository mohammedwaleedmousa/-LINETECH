export type CompanyStatus = "pending" | "approved" | "rejected";
export type CompanyApplication = {
  id:string; company_name:string; contact_name:string; contact_email:string; contact_phone:string;
  description:string; status:CompanyStatus; decision_note:string; company_id:string|null;
  created_at:string; reviewed_at:string|null;
};
export type Company = {id:string;name:string;owner_id:string;created_at:string};
export const companyStatusLabels:Record<CompanyStatus,{ar:string;en:string}>={
  pending:{ar:"قيد المراجعة",en:"Pending review"},approved:{ar:"مقبول",en:"Approved"},rejected:{ar:"مرفوض",en:"Rejected"},
};
export type CompanyInvitation = {id:string;company_id:string;company_name:string;email:string;expires_at:string;created_at:string};
export type CompanyTeam = {
  id:string;name:string;owner:boolean;
  members:{user_id:string;role:"owner"|"member";email:string|null;created_at:string}[];
  invitations:{id:string;email:string;status:"pending"|"accepted"|"declined"|"revoked"|"expired";expires_at:string;created_at:string}[];
};
export const invitationStatusLabels = {
  pending:{ar:"بانتظار الرد",en:"Awaiting response"},accepted:{ar:"مقبولة",en:"Accepted"},
  declined:{ar:"مرفوضة",en:"Declined"},revoked:{ar:"ملغاة",en:"Cancelled"},expired:{ar:"منتهية",en:"Expired"},
};
