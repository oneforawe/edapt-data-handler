(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{100:function(e,t,c){"use strict";var s=c(0),n=c(10),a=c(11),r=c(21),i=(c(127),c(128),c(24)),l=c(8),o=c(38),d=c.n(o),j=c(48),b=c(44),h=c.n(b),u={checkAddUserForLogin:function(){var e=Object(j.a)(d.a.mark((function e(t,c){var s;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s={params:{username:t,password:c}},e.abrupt("return",h.a.get("/api/auth/signin",s).then((function(e){if(!e.data.accessToken)throw new Error("Unable to get user token.");return localStorage.setItem("user",JSON.stringify(e.data)),Promise.resolve(e.data)})).catch((function(e){return Promise.reject(e)})));case 2:case"end":return e.stop()}}),e)})));return function(t,c){return e.apply(this,arguments)}}(),removeUserForLogout:function(){localStorage.removeItem("user")}},m=(c(148),c(32)),O=c(1),p=function(){var e=Object(n.b)(),t=Object(n.c)((function(e){return e.auth})),c=t.isLoggingIn,r=t.isLoggedIn,o=Object(n.c)((function(e){return e.message})).message,d=Object(s.useState)(""),j=Object(i.a)(d,2),b=j[0],h=j[1],p=Object(s.useState)(""),x=Object(i.a)(p,2),f=x[0],v=x[1];return r?Object(O.jsx)(a.a,{to:"/database"}):Object(O.jsx)("div",{className:"center",children:Object(O.jsxs)("div",{className:"col-md-12",children:[m.clientIsInDemoMode&&Object(O.jsxs)("div",{className:"card card-container intro-to-demo-mode",children:[Object(O.jsx)("h3",{children:"DEMO MODE"}),Object(O.jsx)("p",{children:"Imagine you are the owner of an automatic carwash business and you'd like to examine your automatically-generated sales reports using this web-app."}),Object(O.jsx)("p",{children:"Imagine the date is 2021 July 25."}),Object(O.jsx)("p",{children:"Use the following to log in:"}),Object(O.jsx)("div",{children:Object(O.jsx)("table",{className:"center-table",children:Object(O.jsxs)("tbody",{children:[Object(O.jsxs)("tr",{children:[Object(O.jsx)("td",{className:"table-left",children:"Username:"}),Object(O.jsx)("td",{className:"table-right",children:"theuser"})]}),Object(O.jsxs)("tr",{children:[Object(O.jsx)("td",{className:"table-left",children:"Password:"}),Object(O.jsx)("td",{className:"table-right",children:"thepassword"})]})]})})})]}),Object(O.jsxs)("div",{className:"card card-container",children:[Object(O.jsx)("img",{src:"//ssl.gstatic.com/accounts/ui/avatar_2x.png",alt:"profile-img",className:"profile-img-card"}),Object(O.jsxs)("form",{onSubmit:function(t){t.preventDefault(),e(function(e,t){return function(c){return c({type:l.f}),u.checkAddUserForLogin(e,t).then((function(e){c({type:l.g,payload:{user:e}})})).catch((function(e){var t=e.response&&e.response.data&&e.response.data.message||e.message||e.toString();c({type:l.e}),c({type:l.l,payload:t})}))}}(b,f))},children:[Object(O.jsxs)("div",{className:"form-group",children:[Object(O.jsx)("label",{htmlFor:"username",children:"Username"}),Object(O.jsx)("input",{type:"text",className:"form-control",name:"username",value:b,onChange:function(e){h(e.target.value)}})]}),Object(O.jsxs)("div",{className:"form-group",children:[Object(O.jsx)("label",{htmlFor:"password",children:"Password"}),Object(O.jsx)("input",{type:"password",className:"form-control",name:"password",value:f,onChange:function(e){v(e.target.value)}})]}),Object(O.jsx)("div",{className:"form-group add-space",children:Object(O.jsxs)("button",{className:"btn btn-primary btn-block",disabled:c,children:[c&&Object(O.jsx)("span",{className:"spinner-border spinner-border-sm"}),Object(O.jsx)("span",{children:"Login"})]})}),o&&Object(O.jsx)("div",{className:"form-group add-space",children:Object(O.jsx)("div",{className:"alert alert-danger",role:"alert",children:o})})]})]}),Object(O.jsx)("div",{className:"bottom-spacing"})]})})},x=c(9),f=c(92),v=c.n(f);function y(){var e=JSON.parse(localStorage.getItem("user"));return e&&e.accessToken?{"x-access-token":e.accessToken}:{}}var g=c(93),N=c.n(g),k=c(49),S=c.n(k);var w={getUserDbInfo:function(e){var t;t=e.getDbFile?{responseType:"blob"}:{};var c=Object(x.a)(Object(x.a)({headers:y()},t),{},{params:e,paramsSerializer:function(e){return v.a.stringify(e,{arrayFormat:"brackets"})}});return e.getDbFile?h.a.get("/api/query",c).then((function(t){var c,s=e.today,n="database-copy-".concat((c=s,"".concat(S()(c).format("YYYY-MM-DD"))),".csv");return N()(t.data,n),Promise.resolve({filename:n})})).catch((function(e){return Promise.reject(e)})):h.a.get("/api/query",c).then((function(e){return Promise.resolve(e.data)})).catch((function(e){return Promise.reject(e)}))}},q=function(e){return function(t){return t({type:l.c}),w.getUserDbInfo(e).then((function(e){t({type:l.d,payload:{filename:e.filename}})})).catch((function(e){var c=e.response&&e.response.data&&e.response.data.message||e.message||e.toString();t({type:l.b}),t({type:l.l,payload:c})}))}},F=c.p+"static/media/download-icon.a9fa46e4.svg",D=c.p+"static/media/check-circle-icon.106a5315.svg",I=(c(156),function(e){return function(t){return t({type:l.j,payload:{query:e}}),w.getUserDbInfo(e).then((function(e){t({type:l.k,payload:{queryResult:e.queryResult}})})).catch((function(e){var c=e.response&&e.response.data&&e.response.data.message||e.message||e.toString();t({type:l.i}),t({type:l.l,payload:c})}))}}),C=c(239),E=(c(40),c(39)),T=c(99),L=c(58),A=c.n(L),M=c(28),U=(c(157),c(158),function(e){var t=e.timeOptionsInput,c=t.queryInput,s=t.setQueryInput,n=t.daysAgoOptions,a=c.timeOptions,r=a.today,i=a.intvlStart,l=a.intvlFinal,o=a.reportDate,d=a.timeSearchSel,j=function(e,t){s(Object(M.a)((function(c){c.timeOptions[e]=t})))},b=[{},{},{}];return b[0].uuid="byNdays",b[1].uuid="byInterval",b[2].uuid="byDate",b[0].heading="Search by previous N days",b[1].heading="Search by date range",b[2].heading="Search by date",b[0].content=Object(O.jsx)(C.a.Field,{id:"search-by-prev-N-days",children:Object(O.jsxs)("label",{children:[Object(O.jsx)("span",{className:"input-label",children:"N:"}),Object(O.jsx)(T.a,{className:"select",defaultInputValue:"7",onChange:function(e){return j("daysAgo",e.value)},options:n})]})}),b[1].content=Object(O.jsxs)(C.a.Field,{id:"search-by-date-range",children:[Object(O.jsx)("div",{children:Object(O.jsxs)("label",{children:[Object(O.jsx)("span",{className:"input-label",children:"Start Date:"}),Object(O.jsx)(A.a,{dateFormat:"yyyy-MM-dd",selected:i,onChange:function(e){return j("intvlStart",e)},selectsStart:!0,startDate:i,endDate:l,maxDate:r})]})}),Object(O.jsx)("div",{children:Object(O.jsxs)("label",{children:[Object(O.jsx)("span",{className:"input-label",children:"Final Date:"}),Object(O.jsx)(A.a,{dateFormat:"yyyy-MM-dd",selected:l,onChange:function(e){return j("intvlFinal",e)},selectsEnd:!0,startDate:i,endDate:l,maxDate:r})]})})]}),b[2].content=Object(O.jsx)(C.a.Field,{id:"search-by-date",children:Object(O.jsxs)("label",{children:[Object(O.jsx)("span",{className:"input-label",children:"Date:"}),Object(O.jsx)(A.a,{dateFormat:"yyyy-MM-dd",selected:o,onChange:function(e){return j("reportDate",e)},maxDate:r})]})}),Object(O.jsx)(E.a,{preExpanded:d,onChange:function(e){return j("timeSearchSel",e)},children:b.map((function(e){return Object(O.jsxs)(E.b,{uuid:e.uuid,children:[Object(O.jsx)(E.d,{children:Object(O.jsx)(E.c,{children:e.heading})}),Object(O.jsx)(E.e,{children:e.content})]},e.uuid)}))})}),P=function(e){var t=e.bayOptionsInput,c=t.queryInput,s=t.setQueryInput,n=c.bayOption,a=function(e){s(Object(M.a)((function(t){t.bayOption=e})))};return Object(O.jsxs)(C.a.Field,{className:"boxed",children:[Object(O.jsx)("div",{className:"query-sub-title",children:"Bays"}),Object(O.jsxs)("div",{className:"query-option-space",children:[Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input",type:"radio",id:"both",checked:"both"===n,onChange:function(){return a("both")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"both",children:"both"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input",type:"radio",id:"1",checked:"1"===n,onChange:function(){return a("1")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"1",children:"1"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input",type:"radio",id:"2",checked:"2"===n,onChange:function(){return a("2")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"2",children:"2"})]})]})]})},G=function(e){var t=e.qntsOptionsInput,c=t.queryInput,s=t.setQueryInput,n=c.quantities,a=n.netSales,r=n.netMoney,l=n.vehicles,o=function(e,t){s(Object(M.a)((function(c){c.quantities[e][t]=!c.quantities[e][t]})))};return Object(O.jsx)("div",{children:Object(O.jsxs)(C.a.Field,{className:"boxed",children:[Object(O.jsx)("div",{className:"query-sub-title",children:"Quantities"}),Object(O.jsxs)("div",{className:"query-option-space",children:[Object(O.jsxs)("div",{className:"query-sub-option-space",children:[Object(O.jsx)("div",{className:"query-sub-sub-title",children:"Net Sales"}),Object(O.jsxs)("div",{className:"query-sub-sub-list",children:[Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"net-sales",checked:!0===a.combined,onChange:function(){return o("netSales","combined")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"net-sales",children:"combined"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"net-sales-cash",checked:!0===a.cash,onChange:function(){return o("netSales","cash")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"net-sales-cash",children:"cash"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"net-sales-credit",checked:!0===a.credit,onChange:function(){return o("netSales","credit")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"net-sales-credit",children:"credit"})]})]})]}),Object(O.jsxs)("div",{className:"query-sub-option-space",children:[Object(O.jsx)("div",{className:"query-sub-sub-title",children:"Net Money"}),Object(O.jsxs)("div",{className:"query-sub-sub-list",children:[Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"net-money-comb",checked:!0===r.combined,onChange:function(){return o("netMoney","combined")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"net-money-comb",children:"combined"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"net-money-cash",checked:!0===r.cash,onChange:function(){return o("netMoney","cash")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"net-money-cash",children:"cash"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"net-money-credit",checked:!0===r.credit,onChange:function(){return o("netMoney","credit")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"net-money-credit",children:"credit"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"net-money-unref",checked:!0===r.unRefunded,onChange:function(){return o("netMoney","unRefunded")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"net-money-unref",children:"unrefunded"})]})]})]}),Object(O.jsxs)("div",{className:"query-sub-option-space",children:[Object(O.jsx)("div",{className:"query-sub-sub-title",children:"Vehicles"}),Object(O.jsxs)("div",{className:"query-sub-multi-list",children:[Object(O.jsx)("div",{className:"query-sub-sub-list",children:Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-comb",checked:!0===l.combined,onChange:function(){return o("vehicles","combined")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-comb",children:"combined"})]})}),Object(O.jsxs)("div",{className:"query-sub-sub-list",children:[Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-cash",checked:!0===l.cash,onChange:function(){return o("vehicles","cash")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-cash",children:"cash"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-credit",checked:!0===l.credit,onChange:function(){return o("vehicles","credit")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-credit",children:"credit"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-acc",checked:!0===l.account,onChange:function(){return o("vehicles","account")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-acc",children:"account"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-emp",checked:!0===l.employee,onChange:function(){return o("vehicles","employee")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-emp",children:"employee"})]})]}),Object(O.jsxs)("div",{className:"query-sub-sub-list",children:[Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-w",checked:!0===l.works,onChange:function(){return o("vehicles","works")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-w",children:"works"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-p",checked:!0===l.premium,onChange:function(){return o("vehicles","premium")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-p",children:"premium"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-d",checked:!0===l.deluxe,onChange:function(){return o("vehicles","deluxe")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-d",children:"deluxe"})]}),Object(O.jsxs)("div",{className:"form-check",children:[Object(O.jsx)("input",{className:"form-check-input checkbox",type:"checkbox",id:"vhcls-e",checked:!0===l.express,onChange:function(){return o("vehicles","express")}}),Object(O.jsx)("label",{className:"form-check-label",htmlFor:"vhcls-e",children:"express"})]})]}),Object(O.jsx)("div",{className:"query-sub-sub-list",children:Object(O.jsx)("div",{children:Object(O.jsx)("button",{className:"query-quantities-toggle-button",type:"button",onClick:function(){return function(){for(var e=0,t=0,c=Object.values(n);t<c.length;t++)for(var a=c[t],r=0,l=Object.values(a);r<l.length;r++)e+=l[r];s(e>=8?Object(M.a)((function(e){for(var t=0,c=Object.entries(e.quantities);t<c.length;t++)for(var s=Object(i.a)(c[t],2),n=s[0],a=s[1],r=0,l=Object.keys(a);r<l.length;r++){var o=l[r];e.quantities[n][o]=!1}})):Object(M.a)((function(e){for(var t=0,c=Object.entries(e.quantities);t<c.length;t++)for(var s=Object(i.a)(c[t],2),n=s[0],a=s[1],r=0,l=Object.keys(a);r<l.length;r++){var o=l[r];e.quantities[n][o]=!0}})))}()},children:"toggle all"})})})]})]})]})]})})},Q={netSales:{combined:!0,cash:!1,credit:!1},netMoney:{combined:!0,cash:!1,credit:!1,unRefunded:!0},vehicles:{combined:!0,cash:!1,credit:!1,account:!1,employee:!1,works:!1,premium:!1,deluxe:!1,express:!1}},R=[{value:"14",label:"14"},{value:"7",label:"7"},{value:"6",label:"6"},{value:"5",label:"5"},{value:"4",label:"4"},{value:"3",label:"3"},{value:"2",label:"2"},{value:"1",label:"1"}];var _=function(e){var t=e.isQuerying,c=e.today,a=new Date(c),r=new Date(c);a.setDate(c.getDate()-1),r.setDate(c.getDate()-7);var l={today:c,yesterday:a,daysAgo:"7",intvlStart:r,intvlFinal:a,reportDate:a,timeSearchSel:["byNdays"]};m.clientIsInDemoMode&&(l=function(){var e=new Date("7/25/21"),t=new Date(e),c=new Date(e);return t.setDate(e.getDate()-1),c.setDate(e.getDate()-7),{today:e,yesterday:t,daysAgo:"7",intvlStart:c,intvlFinal:t,reportDate:t,timeSearchSel:["byNdays"]}}());var o={bayOption:"both",quantities:Q,timeOptions:l},d=Object(s.useState)(o),j=Object(i.a)(d,2),b=j[0],h=j[1],u=Object(n.b)(),p={queryInput:b,setQueryInput:h},x={queryInput:b,setQueryInput:h},f={queryInput:b,setQueryInput:h,daysAgoOptions:R};return Object(O.jsx)("div",{className:"query-section-container",children:Object(O.jsxs)(C.a,{className:"query-section",onSubmit:function(e){e.preventDefault(),u(I(b))},children:[Object(O.jsxs)("div",{className:"side-by-side",children:[Object(O.jsx)(P,{bayOptionsInput:p}),Object(O.jsx)(G,{qntsOptionsInput:x})]}),Object(O.jsx)(U,{timeOptionsInput:f}),Object(O.jsx)("button",{id:"submit-query",type:"submit",className:"btn btn-primary btn-block",disabled:t,children:"Submit"})]})})},J=function(e){var t=e.isQuerying,c=Object(s.useState)("hi"),a=Object(i.a)(c,2),r=a[0],l=a[1],o=Object(n.b)();return Object(O.jsx)("form",{onSubmit:function(e){e.preventDefault(),l("hi"),o(I(r))},children:Object(O.jsx)("button",{type:"submit",className:"btn btn-primary btn-block",disabled:t,children:"Submit (Example)"})})};function W(e){return e.map((function(e,t){return Object(O.jsxs)("div",{className:"quantity-sub-sub-division",children:[Object(O.jsx)("div",{className:"quantity-sub-sub-title",children:e.title}),Object(O.jsxs)("div",{className:"quantity-sub-sub-content",children:[Object(O.jsxs)("div",{className:"quantity-sub-sub-net boxed",children:[Object(O.jsx)("div",{className:"on-top-title",children:e.content[0].title}),Object(O.jsx)("div",{className:"on-bottom-data",children:Object(O.jsx)("div",{className:"quantity-sub-sub-sub-division net boxed",children:e.content[0].content[0].net},t)})]}),Object(O.jsxs)("div",{className:"quantity-sub-sub-per-day boxed",children:[Object(O.jsx)("div",{className:"on-top-title",children:e.content[1].title}),Object(O.jsx)("div",{className:"on-bottom-data",children:Y(e.content[1].content)})]})]})]},t)}))}function Y(e){return e.map((function(e,t){return Object(O.jsxs)("div",{className:"quantity-sub-sub-sub-division per-day",children:[Object(O.jsxs)("div",{className:"day-title",children:[e.reportForWeekday," ",(c=e.reportForDate,"".concat(S()(c,"MM/DD/YYYY").format("M/DD")))]}),Object(O.jsx)("div",{className:"day-datum",children:e.netForDay})]},t);var c}))}var z=function(e){var t=e.queryResult,c=JSON.parse(t),s=c[0].content,n=c[1].content,a=c[2].content,r=function(e){var t;switch(e){case"1":t="Bay 1";break;case"2":t="Bay 2";break;case"both":t="Bays 1 & 2";break;default:throw new Error("The query parameter `bayOption` has an unrecognized value.")}return t}(s),i=function(e){var t,c=e.timeSearchSel,s=e.intervalStr,n=e.interval;switch(c){case"byNdays":t="for the previous ".concat(e.daysAgo," days...");break;case"byInterval":t="for the ".concat(n.days,"-day interval ")+"from ".concat(s.start," (").concat(s.startwkday,") to ").concat(s.final," (").concat(s.finalwkday,")...");break;case"byDate":t="for the date of ".concat(e.reportDate,"...");break;default:throw new Error("The query parameter `timeSearchSel` has an unrecognized value.")}return t}(n),l=function(e){return e.map((function(e,t){return Object(O.jsxs)("div",{className:"quantity-sub-division",children:[Object(O.jsx)("div",{className:"quantity-sub-title",children:e.title}),Object(O.jsx)("div",{className:"quantity-sub-content",children:Object(O.jsx)("div",{children:W(e.content)})})]},t)}))}(a);return Object(O.jsxs)("div",{className:"query-section-container",children:[Object(O.jsx)("div",{className:"query-section",children:Object(O.jsxs)("div",{className:"boxed",children:[Object(O.jsx)("div",{className:"query-sub-title",children:Object(O.jsxs)("span",{children:[r," -- ",i]})}),Object(O.jsx)("div",{className:"query-option-space",children:l})]})}),Object(O.jsx)("hr",{})]})};function V(e){var t=e.today,c=Object(n.c)((function(e){return e.message})).message,s=Object(n.c)((function(e){return e.file})),a=s.isGettingFile,r=s.filename,i=s.getFileFailed,l=Object(n.b)(),o=function(){var e=Object(j.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:l(q({getDbFile:!0,today:t}));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(O.jsxs)("div",{className:"paragraph-like",children:[!a&&Object(O.jsx)("img",{onClick:function(){return o()},src:F,alt:"Download CSV",className:"icon-space clicky"}),a&&Object(O.jsx)("span",{className:"spinner-border spinner-border-sm icon-space"}),"Generate and download a CSV file copy of the contents of the database.",!a&&r&&Object(O.jsxs)("div",{children:[Object(O.jsx)("img",{src:D,alt:"Download CSV",className:"icon-space"}),Object(O.jsxs)("span",{children:["Downloaded file: ",r]})]}),i&&c&&Object(O.jsx)("div",{className:"alert alert-danger reduced-space",role:"alert",children:c})]})}var B=function(){var e=Object(n.c)((function(e){return e.auth})).user,t=Object(n.c)((function(e){return e.message})).message,c=Object(n.c)((function(e){return e.query})),s=c.isQuerying,r=c.queryResult,i=c.queryFailed,l=new Date;return e?Object(O.jsxs)("div",{className:"container",children:[Object(O.jsx)("header",{className:"jumbotron",children:Object(O.jsx)("h3",{children:"Database"})}),Object(O.jsxs)("div",{className:"top-matter",children:[Object(O.jsx)("p",{children:"The database contains selected information from the daily email sales reports for your carwash business."}),Object(O.jsx)(V,{today:l}),Object(O.jsx)("p",{children:"Use the form below to query the database for sales information."})]}),Object(O.jsx)("hr",{}),Object(O.jsx)("h5",{children:"Query Form"}),m.clientIsInExampleMode?Object(O.jsx)(J,{isQuerying:s}):Object(O.jsx)(_,{isQuerying:s,today:l}),Object(O.jsx)("hr",{}),Object(O.jsx)("h5",{children:"Query Results"}),s&&Object(O.jsx)("div",{children:Object(O.jsx)("span",{className:"spinner-border spinner-border-sm"})}),i&&t&&Object(O.jsx)("div",{className:"alert alert-danger",role:"alert",children:t}),r&&Object(O.jsx)(z,{queryResult:r}),Object(O.jsx)("hr",{})]}):Object(O.jsx)(a.a,{to:"/login"})},H=(c(217),function(){var e=Object(n.c)((function(e){return e.auth})).user;return e?Object(O.jsxs)("div",{className:"container",children:[Object(O.jsx)("header",{className:"jumbotron",children:Object(O.jsx)("h3",{children:"User Profile"})}),Object(O.jsxs)("div",{className:"top-matter",children:[Object(O.jsxs)("p",{children:[Object(O.jsx)("strong",{children:"Id:"})," ",e.id]}),Object(O.jsxs)("p",{children:[Object(O.jsx)("strong",{children:"Username:"})," ",e.username]})]})]}):Object(O.jsx)(a.a,{to:"/login"})}),K=(c(218),function(){return Object(n.c)((function(e){return e.auth})).user?Object(O.jsxs)("div",{className:"container",children:[Object(O.jsx)("header",{className:"jumbotron",children:Object(O.jsx)("h3",{children:"About"})}),Object(O.jsxs)("div",{className:"top-matter",children:[Object(O.jsx)("h4",{children:"The App"}),Object(O.jsxs)("div",{className:"indent",children:[Object(O.jsx)("p",{children:"EDAPT = Email-Data Assistant & Processor Tool"}),Object(O.jsx)("p",{children:"A Web-App for Data Ingestion via Email and Data Viewing & Downloading via Website"}),Object(O.jsxs)("ul",{children:[Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"The Problem"}),Object(O.jsx)("span",{className:"li-content",children:"If you have regularly-generated data-containing email messages that you'd like to have automatically processed so that you can easily query the data and download it in a form that's convenient for displaying in a spreadsheet, then you need a tool like EDAPT."})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"The Solution"}),Object(O.jsx)("span",{className:"li-content",children:"EDAPT continually retrieves data from regularly-generated data-containing email messages (via Gmail), parses the email messages to extract the data, ingests that data into a (MySQL) database, allows queries by website graphical user interface (GUI), and allows downloading the contents of the database in the form of a CSV (comma-separated-values) file."})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"Example"}),Object(O.jsx)("span",{className:"li-content",children:"EDAPT is particularly useful for people operating an automated self-serve business (such as a car wash) that has auto-generated (sales report) data sent by email on a daily basis."})]})]})]}),Object(O.jsx)("h4",{children:"The Tech"}),Object(O.jsxs)("div",{className:"indent",children:[Object(O.jsx)("p",{children:"Here are the main technologies involved in the internals and infrastructure for running EDAPT:"}),Object(O.jsxs)("ul",{children:[Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"Content-Display"}),Object(O.jsxs)("span",{className:"li-content",children:[Object(O.jsx)("a",{href:"https://developer.mozilla.org/en-US/docs/Web/HTML",children:"HTML"}),","," "," ",Object(O.jsx)("a",{href:"https://developer.mozilla.org/en-US/docs/Web/CSS",children:"CSS"}),", "," ",Object(O.jsx)("a",{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript",children:"JavaScript/JS"})," "," / ",Object(O.jsx)("a",{href:"https://tc39.es/ecma262/",children:"ECMAScript"}),","," "," ",Object(O.jsx)("a",{href:"https://reactjs.org/",children:"React"}),","," "," ",Object(O.jsx)("a",{href:"https://redux.js.org/",children:"Redux"})]})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"Data"}),Object(O.jsxs)("span",{className:"li-content",children:[Object(O.jsx)("a",{href:"https://www.mysql.com/",children:"MySQL"}),","," "," ",Object(O.jsx)("a",{href:"https://sequelize.org/",children:"Sequelize"})]})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"Email"}),Object(O.jsxs)("span",{className:"li-content",children:[Object(O.jsx)("a",{href:"https://en.wikipedia.org/wiki/Gmail",children:"Gmail"}),","," "," ",Object(O.jsx)("a",{href:"https://cloud.google.com/",children:"Google Cloud Platform"}),","," "," ",Object(O.jsx)("a",{href:"https://github.com/googleapis/google-api-nodejs-client",children:"Google APIs"}),","," "," ",Object(O.jsx)("a",{href:"https://developers.google.com/gmail/api",children:"Gmail API"})]})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"App-Security"}),Object(O.jsxs)("span",{className:"li-content",children:["JSON web tokens (",Object(O.jsx)("a",{href:"https://www.npmjs.com/package/jsonwebtoken",children:"jsonwebtoken"}),"),"," "," ",Object(O.jsx)("a",{href:"https://developers.google.com/identity/protocols/oauth2",children:"OAuth2"})]})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"App-Server"}),Object(O.jsxs)("span",{className:"li-content",children:[Object(O.jsx)("a",{href:"https://nodejs.org/en/",children:"Node"}),","," "," ",Object(O.jsx)("a",{href:"https://expressjs.com/",children:"Express"})]})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"Optional Infrastructure"}),Object(O.jsxs)("span",{className:"li-content",children:["Web-Server system (eg, a "," ",Object(O.jsx)("a",{href:"https://www.gnu.org/software/software.html",children:"GNU"}),"/",Object(O.jsx)("a",{href:"https://en.wikipedia.org/wiki/Linux",children:"Linux"})," "," ","virtual server such as "," ",Object(O.jsx)("a",{href:"https://ubuntu.com/download/server",children:"Ubuntu server"})," in a virtual machine provided by a web-hosting / cloud-service company such as "," ",Object(O.jsx)("a",{href:"https://www.digitalocean.com/",children:"DigitalOcean"}),")"]})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"Optional Web-Server & Managers"}),Object(O.jsxs)("span",{className:"li-content",children:[Object(O.jsx)("a",{href:"https://nginx.org/en/",children:"Nginx"})," (web-server application using reverse proxy),"," "," ",Object(O.jsx)("a",{href:"https://pm2.keymetrics.io/",children:"PM2"})," (process manager), ",Object(O.jsx)("a",{href:"https://github.com/systemd/systemd",children:"systemd"})," "," (system & service manager)"]})]}),Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("span",{className:"li-title",children:"Optional Web Security"}),Object(O.jsxs)("span",{className:"li-content",children:["firewall (",Object(O.jsx)("a",{href:"https://help.ubuntu.com/community/UFW",children:"ufw"}),"), "," ",Object(O.jsx)("a",{href:"https://en.wikipedia.org/wiki/HTTPS",children:"HTTPS"}),", "," ",Object(O.jsx)("a",{href:"https://letsencrypt.org/",children:"LetsEncrypt"})," "," ",Object(O.jsx)("a",{href:"https://certbot.eff.org/",children:"Certbot"})," "," ","(auto-renewal of SSL certificates)"]})]})]})]}),Object(O.jsx)("h4",{children:"The Developer"}),Object(O.jsx)("div",{className:"indent",children:Object(O.jsx)("ul",{children:Object(O.jsxs)("li",{children:[" ",Object(O.jsx)("a",{href:"https://github.com/oneforawe",children:"Andrew Forrester"})]})})}),Object(O.jsx)("div",{className:"bottom-spacing"})]})]}):Object(O.jsx)(a.a,{to:"/login"})}),X=function(){return Object(n.c)((function(e){return e.auth})).user?Object(O.jsxs)("div",{className:"container",children:[Object(O.jsx)("header",{className:"jumbotron",children:Object(O.jsx)("h3",{children:"Error 404"})}),Object(O.jsx)("p",{children:Object(O.jsx)("strong",{children:"Page Not Found"})}),Object(O.jsx)("p",{children:"Use navigation bar to continue."})]}):Object(O.jsx)(a.a,{to:"/login"})},Z=c(16),$=Object(Z.a)();t.a=function(){var e=Object(n.c)((function(e){return e.auth})).user,t=Object(n.b)();Object(s.useEffect)((function(){$.listen((function(e){t({type:l.a})}))}),[t]);return Object(O.jsx)(a.c,{history:$,children:Object(O.jsxs)("div",{children:[Object(O.jsxs)("nav",{className:"navbar navbar-expand navbar-dark bg-dark",children:[Object(O.jsx)("div",{className:"navbar-brand",children:"EDAPT"}),e?Object(O.jsxs)("div",{className:"navbar-nav ml-auto",children:[Object(O.jsx)("li",{className:"nav-item",children:Object(O.jsx)(r.a,{to:"/database",className:"nav-link",children:"Database"})}),Object(O.jsx)("li",{className:"nav-item",children:Object(O.jsx)(r.a,{to:"/profile",className:"nav-link",children:"Profile"})}),Object(O.jsx)("li",{className:"nav-item",children:Object(O.jsx)(r.a,{to:"/about",className:"nav-link",children:"About"})}),Object(O.jsx)("li",{className:"nav-item",children:Object(O.jsx)("a",{href:"/login",className:"nav-link",onClick:function(){t((function(e){u.removeUserForLogout(),e({type:l.h})}))},children:"LogOut"})})]}):Object(O.jsx)("div",{className:"navbar-nav ml-auto",children:Object(O.jsx)("li",{className:"nav-item",children:Object(O.jsx)(r.a,{to:"/login",className:"nav-link",children:"LogIn"})})})]}),Object(O.jsx)("div",{className:"container mt-3",children:Object(O.jsxs)(a.d,{children:[Object(O.jsx)(a.b,{exact:!0,path:["/","/login"],component:p}),Object(O.jsx)(a.b,{exact:!0,path:"/database",component:B}),Object(O.jsx)(a.b,{exact:!0,path:"/profile",component:H}),Object(O.jsx)(a.b,{exact:!0,path:"/about",component:K}),Object(O.jsx)(a.b,{component:X})]})})]})})}},101:function(e,t,c){"use strict";var s=c(36),n=c(97),a=c(98),r=c(9),i=c(8),l=JSON.parse(localStorage.getItem("user")),o=l?{isLogginIn:!1,isLoggedIn:!0,user:l}:{isLogginIn:!1,isLoggedIn:!1,user:null};var d={};var j={isGettingFile:!1,filename:null,getFileFailed:!1};var b={isQuerying:!1,query:null,queryResult:null,queryFailed:!1};var h=Object(s.combineReducers)({auth:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,t=arguments.length>1?arguments[1]:void 0,c=t.type,s=t.payload;switch(c){case i.f:return Object(r.a)(Object(r.a)({},e),{},{isLoggingIn:!0});case i.g:return Object(r.a)(Object(r.a)({},e),{},{isLoggingIn:!1,isLoggedIn:!0,user:s.user});case i.e:return Object(r.a)(Object(r.a)({},e),{},{isLoggingIn:!1,isLoggedIn:!1,user:null});case i.h:return Object(r.a)(Object(r.a)({},e),{},{isLoggedIn:!1,user:null});default:return e}},message:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d,t=arguments.length>1?arguments[1]:void 0,c=t.type,s=t.payload;switch(c){case i.l:return{message:s};case i.a:return{message:""};default:return e}},file:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j,t=arguments.length>1?arguments[1]:void 0,c=t.type,s=t.payload;switch(c){case i.c:return Object(r.a)(Object(r.a)({},e),{},{isGettingFile:!0,filename:null,getFileFailed:!1});case i.d:return Object(r.a)(Object(r.a)({},e),{},{isGettingFile:!1,filename:s.filename});case i.b:return Object(r.a)(Object(r.a)({},e),{},{isGettingFile:!1,getFileFailed:!0});default:return e}},query:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b,t=arguments.length>1?arguments[1]:void 0,c=t.type,s=t.payload;switch(c){case i.j:return Object(r.a)(Object(r.a)({},e),{},{isQuerying:!0,query:s.query,queryResult:null,queryFailed:!1});case i.k:return Object(r.a)(Object(r.a)({},e),{},{isQuerying:!1,queryResult:s.queryResult});case i.i:return Object(r.a)(Object(r.a)({},e),{},{isQuerying:!1,queryFailed:!0});default:return e}}}),u=[a.a],m=Object(s.createStore)(h,Object(n.composeWithDevTools)(s.applyMiddleware.apply(void 0,u)));t.a=m},102:function(e,t,c){"use strict";c.r(t),function(e){var t,s=c(90),n=c(0),a=c.n(n),r=c(15),i=c.n(r),l=c(71),o=c(100),d=c(10),j=c(101),b=(c(219),c(1)),h=e.location.hostname.split(".");t=h.length>1?h.splice(-2)[0]:h[0],i.a.render(Object(b.jsxs)(a.a.StrictMode,{children:[Object(b.jsx)(l.b,{children:Object(b.jsx)(l.a,{children:Object(b.jsxs)("title",{children:["EDAPT @ ",t]})})}),Object(b.jsx)(d.a,{store:j.a,children:Object(b.jsx)(o.a,{})})]}),document.getElementById("root")),Object(s.a)()}.call(this,c(45))},128:function(e,t,c){},148:function(e,t,c){},156:function(e,t,c){},217:function(e,t,c){},218:function(e,t,c){},219:function(e,t,c){},32:function(e,t){var c={clientIsInExampleMode:!1,clientIsInDemoMode:!1};e.exports=c},40:function(e,t,c){},8:function(e,t,c){"use strict";c.d(t,"f",(function(){return s})),c.d(t,"g",(function(){return n})),c.d(t,"e",(function(){return a})),c.d(t,"h",(function(){return r})),c.d(t,"l",(function(){return i})),c.d(t,"a",(function(){return l})),c.d(t,"c",(function(){return o})),c.d(t,"d",(function(){return d})),c.d(t,"b",(function(){return j})),c.d(t,"j",(function(){return b})),c.d(t,"k",(function(){return h})),c.d(t,"i",(function(){return u}));var s="LOGIN_START",n="LOGIN_SUCCESS",a="LOGIN_FAIL",r="LOGOUT",i="SET_MESSAGE",l="CLEAR_MESSAGE",o="GET_FILE_START",d="GET_FILE_SUCCESS",j="GET_FILE_FAIL",b="QUERY_START",h="QUERY_SUCCESS",u="QUERY_FAIL"},90:function(e,t,c){"use strict";t.a=function(e){e&&e instanceof Function&&c.e(3).then(c.bind(null,224)).then((function(t){var c=t.getCLS,s=t.getFID,n=t.getFCP,a=t.getLCP,r=t.getTTFB;c(e),s(e),n(e),a(e),r(e)}))}}},[[102,1,2]]]);
//# sourceMappingURL=main.712df67f.chunk.js.map