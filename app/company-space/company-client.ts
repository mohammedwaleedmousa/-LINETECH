export async function companyFetch(url:string,init:RequestInit={}){
  const response=await fetch(url,{cache:"no-store",...init});
  if(response.status===401){
    window.location.assign("/login?next="+encodeURIComponent(window.location.pathname+window.location.search));
    throw new Error("401");
  }
  const data=await response.json();
  if(!response.ok||!data.ok)throw new Error(String(response.status));
  return data;
}
export function teamError(error:unknown,ar:boolean){
  const code=error instanceof Error?error.message:"";
  if(code==="403")return ar?"لا تملك صلاحية هذا الإجراء، أو أن البريد الإلكتروني غير موثّق.":"You do not have permission, or your email address is not verified.";
  if(code==="409")return ar?"تغيّرت حالة الدعوة أو أن الحساب عضو بالفعل. حدّث القائمة للمراجعة.":"The invitation has changed or the account is already a member. Refresh the list to check.";
  if(code==="429")return ar?"طلبات كثيرة. انتظر دقيقة ثم حاول مجددًا.":"Too many requests. Wait a minute and try again.";
  if(code==="400")return ar?"راجع البيانات المطلوبة وحاول مجددًا.":"Check the required details and try again.";
  return ar?"تعذّر إكمال الطلب. حاول مجددًا.":"Could not complete the request. Please try again.";
}
