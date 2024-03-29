const nameReg = /^[^a-zA-Z]*$/;
const phoneReg = /^[^0-9]*$/;
const emailReg =
   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validMessage(data: Form) {
   if (!data.name || nameReg.test(data.name)) return { valid: false, msg: "Please enter a valid name" };
   if (!data.email?.match(emailReg)) return { valid: false, msg: "Please enter a valid email" };
   if (!data.message) return { valid: false, msg: "You forgot to write the message :(" };
   if (data.phone) if (phoneReg.test(data.phone)) return { valid: false, msg: "Please provide a valid phone number" };

   return { valid: true, msg: "All fields are valid" };
}

interface Form {
   name: string | undefined;
   phone: string | undefined;
   email: string | undefined;
   message: string | undefined;
}
