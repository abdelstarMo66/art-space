const verificationMessage = (name, activateCode,) => `Hi ${name},\nYour verification code is ${activateCode}.\nEnter this code in our [website or app] to activate your [customer portal] account.\nWe’re glad you’re here!\nThe Art Space team\n`;

const resetMessage = (name, resetCode) => `Hi ${name},\nThere was a request to change your password!\nIf you did not make this request then please ignore this email.\nOtherwise, please enter this code to change your password: ${resetCode}\n`;

const resendMessage = (name, code)=>`Hi ${name},\nYour verification code is ${code}.\nEnter this code in our [website or app] to activate your [customer portal] account.\nWe’re glad you’re here!\nThe Art Space team\n`;

module.exports = {
    verificationMessage,
    resetMessage,
    resendMessage,
}