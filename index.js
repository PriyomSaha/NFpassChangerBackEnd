// const functions = require("firebase-functions");
const falso = require("@ngneat/falso");
const puppeteer = require("puppeteer");
const express = require("express");

const app = express();

const config = { headless: false };
const port = 4000;
const loginPage = {
  emailTextBox: "input#id_userLoginId",
  passwordTextBox: "input#id_password",
  signInButton: "button.login-button",
};

const browsePage = {
  h1Text: "h1.profile-gate-label",
};

const changePasswordPage = {
  currentPasswordTextBox: "input#id_currentPassword",
  newPasswordTextBox: "input#id_newPassword",
  confirmPasswordTextBox: "input#id_confirmNewPassword",
  requireAllDeviceToSignInCheckBox: "input#cb_requireAllDevicesSignIn",
  saveButton: "button#btn-save",
};

var page, browser;
var now = new Date();
var date = `${now.getDate()}_${
  now.getMonth() + 1
}_${now.getFullYear()}_${now.getHours()}_${now.getSeconds()}_${now.getMilliseconds()}`;

let newPass = falso.randFullName();
let curPass = "Amphon Björnsson";

console.log("Running in Port : " + port);
try {
  app.get("/changePass", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    let screenshotBuffer;
    try {
      browser = await puppeteer.launch(config);
      page = await browser.newPage();
      await page.goto("https://www.netflix.com/in/login", {
        waitUntil: "networkidle2",
      });

      await page.waitForSelector(loginPage.emailTextBox);
      await page.type(loginPage.emailTextBox, "cloud.iot98@gmail.com");
      await page.type(loginPage.passwordTextBox, curPass);
      await page.click(loginPage.signInButton);

      await page.waitForSelector(browsePage.h1Text);
      await page.goto("https://www.netflix.com/password");

      await page.waitForSelector(changePasswordPage.currentPasswordTextBox);
      await page.type(changePasswordPage.currentPasswordTextBox, curPass);
      await page.type(changePasswordPage.newPasswordTextBox, newPass);
      await page.type(changePasswordPage.confirmPasswordTextBox, newPass);
      await page.click(changePasswordPage.requireAllDeviceToSignInCheckBox);
      // await page.click(changePasswordPage.saveButton);
      console.log(newPass);

      res.status(200);
    } catch (e) {
      screenshotBuffer = await page.screenshot({
        path: `screenshot/error_${date}.png`,
      });
      res.status(400);
    }
    res.end(screenshotBuffer);
    await page.waitForTimeout(10000);
    await browser.close();
  });
} catch (e) {
  console.log(e);
}

const updatePasswordToDb = async () => {};

app.listen(port);
// exports.app = functions.https.onRequest(app);
