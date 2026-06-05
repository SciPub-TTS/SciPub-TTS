// import {useState} from "react";
// import {Link, useNavigate} from "react-router-dom";
// import {ROUTES} from "@/app/router";
// // import {AUTH_ROLES, type AuthRole} from "@/features/auth/constants/roles";
// import {submitRegister} from "@/features/auth/services/authFlows.ts";
// import {getApiErrorMessage} from "@/features/auth/utils/getApiErrorMessage.ts";
// import {authApi} from "@/features/auth/services/auth.api.ts";
// import type {RegisterLocalRequest} from "@/features/auth/types/auth.types.ts";
// import {registerSchema} from "@/features/auth/validators/auth.schema.ts";
// import PasswordStrength from "@/features/auth/components/PasswordStrength.tsx";
//
// // type PublicRole = Exclude<AuthRole, "ADMIN">;
//
// // const ROLES: { value: PublicRole; label: string; sub: string; icon: React.ReactNode }[] = [
// //     {
// //         value: AUTH_ROLES.USER,
// //         label: "Researcher",
// //         sub: "PHD, POSTDOC, PI",
// //         icon: (
// //             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
// //                 <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
// //                 <path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// //                 <path d="M11 8v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// //             </svg>
// //         ),
// //     }
// // ];
//
//
//
// export default function RegisterPage() {
//     const navigate = useNavigate();
//
//     const [form, setForm] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     });
//     // const [role, setRole] = useState<PublicRole>(AUTH_ROLES.USER);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     // const [acceptTerms, setAcceptTerms] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState("");
//
//     function set(field: keyof typeof form) {
//         return (e: React.ChangeEvent<HTMLInputElement>) =>
//             setForm((prev) => ({...prev, [field]: e.target.value}));
//     }
//
//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         // if (!acceptTerms) {
//         //     setError("Bạn cần đồng ý điều khoản sử dụng.");
//         //     return;
//         // }
//
//         const validation = registerSchema.safeParse({
//             firstName: form.firstName.trim(),
//             lastName: form.lastName.trim(),
//             email: form.email.trim(),
//             password: form.password,
//             confirmPassword: form.confirmPassword,
//         });
//
//         if (!validation.success) {
//             setError(validation.error.issues[0]?.message ?? "Invalid registration data.");
//             return;
//         }
//
//         try {
//             setSubmitting(true);
//             setError("");
//
//             const payload: RegisterLocalRequest = {
//                 firstName: validation.data.firstName,
//                 lastName: validation.data.lastName,
//                 email: validation.data.email,
//                 password: validation.data.password,
//                 confirmPassword: validation.data.confirmPassword,
//             };
//
//             const response = await submitRegister(payload);
//
//             navigate(ROUTES.LOGIN, {
//                 replace: true,
//                 state: {
//                     successMessage:
//                         response.message ??
//                         "Registration successful! Please check your email to verify your account.",
//                     registeredEmail: validation.data.email,
//                 },
//             });
//         } catch (err) {
//             setError(getApiErrorMessage(err, "Registration failed. Please try again."));
//         } finally {
//             setSubmitting(false);
//         }
//     }
//
//     function handleGoogleLogin() {
//         try {
//             authApi.startGoogleLogin();
//         } catch (err) {
//             setError(getApiErrorMessage(err, "Google login is not configured yet."));
//         }
//     }
//
//     return (
//         <div className="min-h-screen bg-white flex flex-col">
//             {/* Header */}
//             <header className="flex items-center justify-between px-8 h-14 border-b border-slate-100">
//                 <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
//                     <div className="w-7 h-7 rounded-md bg-emerald-800 flex items-center justify-center">
//                         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                             <path d="M2 10 Q7 2 12 10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"
//                                   fill="none"/>
//                             <circle cx="7" cy="5.5" r="1.2" fill="#6ee7b7"/>
//                         </svg>
//                     </div>
//                     <div>
//                         <div className="text-sm font-semibold text-slate-900 leading-none">Research Trend Tracker</div>
//                         <div className="text-[10px] tracking-widest text-slate-400 leading-none mt-0.5">RTT · V2.4</div>
//                     </div>
//                 </Link>
//                 <Link to={ROUTES.HOME}
//                       className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
//                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                         <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
//                               strokeLinejoin="round"/>
//                     </svg>
//                     Back to home
//                 </Link>
//             </header>
//
//             {/* Main */}
//             <div className="flex flex-1 min-h-0">
//                 {/* Left — Form */}
//                 <div className="flex-1 flex items-start justify-center px-8 py-10 lg:max-w-[580px] overflow-y-auto">
//                     <div className="w-full max-w-[420px]">
//                         <div className="mb-7">
//                             <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-3 flex items-center gap-1.5">
//                                 <span className="inline-block w-1 h-1 rounded-full bg-emerald-500"/>
//                                 Step 01 / 01 · Create account
//                             </p>
//                             <h1 className="font-serif text-[2.4rem] leading-[1.12] text-slate-950">
//                                 Start tracking the field
//                             </h1>
//                             <h1 className="font-serif text-[2.4rem] leading-[1.12] italic text-emerald-700 mb-3">
//                                 before it moves.
//                             </h1>
//                             <p className="text-sm text-slate-500 leading-relaxed">
//                                 Free for accredited academics. We'll personalize your trend feed from the moment you
//                                 sign up — no empty dashboard.
//                             </p>
//                         </div>
//
//                         {error && (
//                             <div
//                                 className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
//                                 {error}
//                             </div>
//                         )}
//
//                         {/* Google */}
//                         <button
//                             type="button"
//                             onClick={handleGoogleLogin}
//                             className="w-full flex items-center justify-center gap-2.5 h-11 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-5"
//                         >
//                             <svg width="17" height="17" viewBox="0 0 24 24">
//                                 <path
//                                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                     fill="#4285F4"/>
//                                 <path
//                                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                     fill="#34A853"/>
//                                 <path
//                                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                     fill="#FBBC05"/>
//                                 <path
//                                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                     fill="#EA4335"/>
//                             </svg>
//                             Continue with Google
//                         </button>
//
//                         <div className="relative flex items-center gap-3 mb-5">
//                             <div className="flex-1 h-px bg-slate-100"/>
//                             <span className="text-[11px] tracking-widest text-slate-400 uppercase">or with email</span>
//                             <div className="flex-1 h-px bg-slate-100"/>
//                         </div>
//
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             {/* Name row */}
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1.5">First
//                                         name</label>
//                                     <div className="relative">
//                                         <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                                              width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                             <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
//                                             <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor"
//                                                   strokeWidth="1.5" strokeLinecap="round"/>
//                                         </svg>
//                                         <input
//                                             type="text"
//                                             value={form.firstName}
//                                             onChange={set("firstName")}
//                                             placeholder="Mariana"
//                                             required
//                                             className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
//                                     <div className="relative">
//                                         <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                                              width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                             <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
//                                             <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor"
//                                                   strokeWidth="1.5" strokeLinecap="round"/>
//                                         </svg>
//                                         <input
//                                             type="text"
//                                             value={form.lastName}
//                                             onChange={set("lastName")}
//                                             placeholder="Velasquez"
//                                             required
//                                             className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Email */}
//                             <div>
//                                 <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
//                                 <div className="relative">
//                                     <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14"
//                                          height="14" viewBox="0 0 24 24" fill="none">
//                                         <path
//                                             d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
//                                             stroke="currentColor" strokeWidth="1.5"/>
//                                         <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5"/>
//                                     </svg>
//                                     <input
//                                         type="email"
//                                         value={form.email}
//                                         onChange={set("email")}
//                                         placeholder="your.email@university.edu"
//                                         required
//                                         className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                                     />
//                                 </div>
//                             </div>
//
//                             {/* Password row */}
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
//                                     <div className="relative">
//                                         <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                                              width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                             <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor"
//                                                   strokeWidth="1.5"/>
//                                             <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5"
//                                                   strokeLinecap="round"/>
//                                         </svg>
//                                         <input
//                                             type={showPassword ? "text" : "password"}
//                                             value={form.password}
//                                             onChange={set("password")}
//                                             placeholder="At least 10 characters"
//                                             required
//                                             minLength={10}
//                                             className="w-full h-11 pl-9 pr-8 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                                         />
//                                         <button type="button" onClick={() => setShowPassword((v) => !v)}
//                                                 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
//                                             <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//                                                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
//                                                       stroke="currentColor" strokeWidth="1.5"/>
//                                                 <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
//                                             </svg>
//                                         </button>
//                                     </div>
//                                     <PasswordStrength password={form.password}/>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm
//                                         password</label>
//                                     <div className="relative">
//                                         <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                                              width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                             <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor"
//                                                   strokeWidth="1.5"/>
//                                             <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5"
//                                                   strokeLinecap="round"/>
//                                         </svg>
//                                         <input
//                                             type={showConfirm ? "text" : "password"}
//                                             value={form.confirmPassword}
//                                             onChange={set("confirmPassword")}
//                                             placeholder="Re-enter password"
//                                             required
//                                             minLength={10}
//                                             className="w-full h-11 pl-9 pr-8 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                                         />
//                                         <button type="button" onClick={() => setShowConfirm((v) => !v)}
//                                                 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
//                                             <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//                                                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
//                                                       stroke="currentColor" strokeWidth="1.5"/>
//                                                 <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
//                                             </svg>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//
//                       {/*      /!* Role picker *!/*/}
//                       {/*      <div>*/}
//                       {/*          <label className="block text-sm font-medium text-slate-700 mb-2">I'm joining as*/}
//                       {/*              a</label>*/}
//                       {/*          <div className="grid grid-cols-3 gap-2">*/}
//                       {/*              {ROLES.map((r) => (*/}
//                       {/*                  <button*/}
//                       {/*                      key={r.value}*/}
//                       {/*                      type="button"*/}
//                       {/*                      onClick={() => setRole(r.value)}*/}
//                       {/*                      className={`relative flex flex-col items-start gap-1.5 px-3 py-3 rounded-lg border text-left transition-all ${*/}
//                       {/*                          role === r.value*/}
//                       {/*                              ? "bg-emerald-900 border-emerald-700 text-white"*/}
//                       {/*                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"*/}
//                       {/*                      }`}*/}
//                       {/*                  >*/}
//                       {/*                      {role === r.value && (*/}
//                       {/*                          <svg className="absolute top-2 right-2" width="13" height="13"*/}
//                       {/*                               viewBox="0 0 13 13" fill="none">*/}
//                       {/*                              <circle cx="6.5" cy="6.5" r="6.5" fill="#34d399"/>*/}
//                       {/*                              <path d="M3.5 6.5l2 2 4-4" stroke="white" strokeWidth="1.4"*/}
//                       {/*                                    strokeLinecap="round" strokeLinejoin="round"/>*/}
//                       {/*                          </svg>*/}
//                       {/*                      )}*/}
//                       {/*                      <span className={role === r.value ? "text-emerald-300" : "text-slate-500"}>*/}
//                       {/*  {r.icon}*/}
//                       {/*</span>*/}
//                       {/*                      <span className="text-sm font-semibold">{r.label}</span>*/}
//                       {/*                      <span*/}
//                       {/*                          className={`text-[10px] tracking-wide uppercase ${role === r.value ? "text-emerald-400/70" : "text-slate-400"}`}>*/}
//                       {/*  {r.sub}*/}
//                       {/*</span>*/}
//                       {/*                  </button>*/}
//                       {/*              ))}*/}
//                       {/*          </div>*/}
//                       {/*      </div>*/}
//
//                             {/* Terms */}
//                             {/* <label className="flex items-start gap-2.5 cursor-pointer select-none">*/}
//                             {/* <div*/}
//                             {/* onClick={() => setAcceptTerms((v) => !v)}*/}
//                             {/* className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-all ${*/}
//                             {/* acceptTerms ? "bg-emerald-700 border-emerald-700" : "border-slate-300 bg-white"*/}
//                             {/* }`}*/}
//                             {/* >*/}
//                             {/* {acceptTerms && (*/}
//                             {/* <svg width="10" height="10" viewBox="0 0 12 12" fill="none">*/}
//                             {/* <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />*/}
//                             {/* </svg>*/}
//                             {/* )}*/}
//                             {/* </div>*/}
//                             {/* <span className="text-sm text-slate-500 leading-relaxed">*/}
//                             {/* I agree to the{" "}*/}
//                             {/* <a href="#" className="text-emerald-700 hover:underline font-medium">Terms</a>{" "}*/}
//                             {/* and{" "}*/}
//                             {/* <a href="#" className="text-emerald-700 hover:underline font-medium">Privacy Policy</a>*/}
//                             {/* , and consent to receive a weekly trend digest (1 email · unsubscribe anytime).*/}
//                             {/*</span>*/}
//                             {/* </label>*/}
//
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="w-full h-11 rounded-lg bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
//                             >
//                                 {submitting ? (
//                                     <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24"
//                                          fill="none">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
//                                                 strokeWidth="3"/>
//                                         <path className="opacity-75" fill="currentColor"
//                                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                                     </svg>
//                                 ) : (
//                                     <>
//                                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//                                             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
//                                                   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
//                                                   strokeLinejoin="round"/>
//                                         </svg>
//                                         Create account & build my feed →
//                                     </>
//                                 )}
//                             </button>
//                         </form>
//
//                         <p className="mt-5 text-sm text-slate-500 text-center">
//                             Already have an account?{" "}
//                             <Link to={ROUTES.LOGIN}
//                                   className="text-emerald-700 font-medium hover:underline">Login</Link>
//                         </p>
//                     </div>
//                 </div>
//
//                 {/* Right — Light preview panel */}
//                 <div
//                     className="hidden lg:flex flex-1 bg-slate-50 border-l border-slate-100 flex-col justify-center p-10 relative overflow-hidden">
//                     {/* Preview card */}
//                     <div
//                         className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden max-w-[420px]">
//                         {/* Card header */}
//                         <div className="bg-emerald-900 px-5 py-3 flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-5 h-5 rounded bg-emerald-700 flex items-center justify-center">
//                                     <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
//                                         <path d="M2 10 Q7 2 12 10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"
//                                               fill="none"/>
//                                     </svg>
//                                 </div>
//                                 <span className="text-xs text-white font-medium">Your feed · live preview</span>
//                             </div>
//                             <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
//                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
//                                 PERSONALIZING
//                             </div>
//                         </div>
//
//                         <div className="p-5">
//                             <p className="text-[10px] tracking-widest text-slate-400 uppercase mb-1">
//                                 <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 mr-1 mb-0.5"/>
//                                 Welcome, Researcher
//                             </p>
//                             <h3 className="font-serif text-xl text-slate-900 leading-snug mb-1">
//                                 Build your personalized<br/>research trend feed.
//                             </h3>
//                             <p className="text-xs text-slate-500 mb-4">
//                                 No empty dashboard. We seed your feed from your field and keywords the moment you sign
//                                 up.
//                             </p>
//
//                             <p className="text-[10px] tracking-widest text-slate-400 uppercase mb-2">Tracking
//                                 signals</p>
//                             <div className="flex flex-wrap gap-1.5 mb-4">
//                                 {["Computer Science", "Mechanistic Interpretability", "Diffusion Models"].map((tag) => (
//                                     <span key={tag}
//                                           className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900 text-emerald-300">
//                     {tag}
//                   </span>
//                                 ))}
//                             </div>
//
//                             {/* Mini charts row */}
//                             <div className="grid grid-cols-2 gap-3 mb-4">
//                                 {[
//                                     {label: "MECH. INTERPRETABIL", pct: "+247%"},
//                                     {label: "DIFFUSION MODELS", pct: "+132%"},
//                                 ].map((c) => (
//                                     <div key={c.label} className="rounded-lg border border-slate-100 p-3">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <span
//                                                 className="text-[9px] text-slate-400 uppercase truncate">{c.label}</span>
//                                             <span className="text-[10px] font-semibold text-emerald-600">{c.pct}</span>
//                                         </div>
//                                         <svg width="100%" height="28" viewBox="0 0 100 28" preserveAspectRatio="none">
//                                             <path d="M0 24 Q25 20 50 14 Q75 8 100 4" stroke="#059669" strokeWidth="1.5"
//                                                   fill="none"/>
//                                         </svg>
//                                     </div>
//                                 ))}
//                             </div>
//
//                             {/* Field activity */}
//                             <div className="rounded-lg border border-slate-100 p-3 mb-4">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <div>
//                                         <p className="text-[9px] text-slate-400 uppercase tracking-wide">Field Activity
//                                             · Last 10 weeks</p>
//                                         <p className="text-sm font-semibold text-slate-800">Computer Science</p>
//                                     </div>
//                                     <span className="text-xs text-emerald-600 font-semibold">↗ +38.4%</span>
//                                 </div>
//                                 <div className="flex items-end gap-1 h-10">
//                                     {[40, 48, 55, 52, 62, 70, 68, 78, 85, 95].map((h, i) => (
//                                         <div
//                                             key={i}
//                                             className="flex-1 rounded-sm bg-blue-500"
//                                             style={{height: `${h}%`, opacity: 0.7 + i * 0.03}}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>
//
//                             {/* Alert */}
//                             <div className="rounded-lg bg-emerald-950 p-3 flex gap-2.5">
//                                 <div
//                                     className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
//                                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
//                                         <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
//                                               stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//                                     </svg>
//                                 </div>
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-0.5">
//                                         <span className="text-[9px] text-slate-500 uppercase tracking-wide">Sample alert · Tue 09:14</span>
//                                         <span className="text-[9px] text-slate-600 ml-auto">AUTO</span>
//                                     </div>
//                                     <p className="text-xs text-slate-300">
//                                         3 new papers on Mechanistic Interpretability posted to arXiv overnight — one
//                                         already trending.
//                                     </p>
//                                     <div className="flex gap-2 mt-2">
//                                         <button
//                                             className="px-2.5 py-1 rounded bg-emerald-800 text-[10px] text-white font-medium">Open
//                                             feed
//                                         </button>
//                                         <button
//                                             className="px-2.5 py-1 rounded bg-white/10 text-[10px] text-slate-400">Snooze
//                                             1 day
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Footer */}
//                         <div className="border-t border-slate-100 px-5 py-3 space-y-1">
//                             {[
//                                 "Personalized feed seeded from your first keyword",
//                                 "Weekly digest, snoozable per topic",
//                                 "Export any insight to BibTeX / Zotero",
//                             ].map((item) => (
//                                 <p key={item} className="text-xs text-slate-500 flex items-center gap-2">
//                                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                                         <circle cx="6" cy="6" r="5.5" stroke="#059669" strokeWidth="1"/>
//                                         <path d="M3.5 6l2 2 3-3" stroke="#059669" strokeWidth="1.2"
//                                               strokeLinecap="round" strokeLinejoin="round"/>
//                                     </svg>
//                                     {item}
//                                 </p>
//                             ))}
//                         </div>
//                     </div>
//
//                     <p className="text-[10px] tracking-widest text-slate-400 uppercase text-center mt-5">
//                         <span className="inline-block w-1 h-1 rounded-full bg-slate-300 mr-1.5 mb-0.5"/>
//                         Different from a search engine — trends, not paper lists.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthHeader from "@/features/auth/components/common/AuthHeader";
import { authApi } from "@/features/auth/services/auth.api";
import { submitRegister } from "@/features/auth/services/authFlows";
import type { RegisterLocalRequest } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { registerSchema } from "@/features/auth/validators/auth.schema";
import RegisterFormPanel from "@/features/auth/components/panel/RegisterFormPanel.tsx";
import RegisterPreviewPanel from "@/features/auth/components/panel/RegisterReviewPanel.tsx";

type RegisterFormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const initialForm: RegisterFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterFormState>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(field: keyof RegisterFormState, value: string) {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError("");

        const validation = registerSchema.safeParse({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            password: form.password,
            confirmPassword: form.confirmPassword,
        });

        if (!validation.success) {
            setError(
                validation.error.issues[0]?.message ?? "Invalid registration data.",
            );
            return;
        }

        try {
            setSubmitting(true);

            const payload: RegisterLocalRequest = {
                firstName: validation.data.firstName,
                lastName: validation.data.lastName,
                email: validation.data.email,
                password: validation.data.password,
                confirmPassword: validation.data.confirmPassword,
            };

            const response = await submitRegister(payload);

            navigate(ROUTES.LOGIN, {
                replace: true,
                state: {
                    successMessage:
                        response.message ??
                        "Registration successful! Please check your email to verify your account.",
                    registeredEmail: validation.data.email,
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "Registration failed. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    function handleGoogleLogin() {
        try {
            authApi.startGoogleLogin();
        } catch (err) {
            setError(getApiErrorMessage(err, "Google login is not configured yet."));
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <AuthHeader backTo={ROUTES.HOME} backLabel="Back to home" />

            <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
                <RegisterFormPanel
                    form={form}
                    error={error}
                    submitting={submitting}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onGoogleLogin={handleGoogleLogin}
                />

                <RegisterPreviewPanel />
            </main>
        </div>
    );
}