import { remote } from 'webdriverio';
import assert from 'assert';
import fs from 'fs';

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': '.Settings',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4724,
  logLevel: 'info',
  capabilities: {
    ...capabilities,
    'appium:autoScreenRecording': true,
    'appium:screenRecordingSize': '720x1280',
  },
};

// 🔁 Click on ID
async function clickButtonById(driver, id, timeout = 5000) {
  const el = await driver.$(`id=${id}`);
  await el.waitForDisplayed({ timeout });
  await el.waitForEnabled({ timeout });
  await el.click();
}

async function runTest() {
  const driver = await remote(wdOpts);
  
  const NUMBER_7 = 7;
  const NUMBER_8 = 8;

  try {
    await driver.pause(3000);

    // Click on "Search Settings"
    const searchTitle = await driver.$(`android=new UiSelector().text("Search Settings")`);
    await searchTitle.click();

    // Enter "Calculator"
    const inputField = await driver.$('android.widget.EditText');
    await inputField.waitForDisplayed({ timeout: 5000 });
    await inputField.addValue('C');
    await inputField.setValue('Calculator');
    await driver.pause(6000);

    // Open Calculator app
    const results = await driver.$$(`android=new UiSelector().text("Calculator")`);
    await results[1].click();
    await driver.pause(3000);

    const icon = await driver.$('android=new UiSelector().description("Open")');
    await icon.click();
    await driver.pause(3000);

    // Click on Calculator button
    await clickButtonById(driver, 'com.google.android.calculator:id/clr');
    await clickButtonById(driver, `com.google.android.calculator:id/digit_${NUMBER_7}`);
    await clickButtonById(driver, 'com.google.android.calculator:id/op_add');
    await clickButtonById(driver, `com.google.android.calculator:id/digit_${NUMBER_8}`);
    await clickButtonById(driver, 'com.google.android.calculator:id/eq');

    await driver.pause(3000);

    // Check results
    const resultElement = await driver.$('id=com.google.android.calculator:id/result_final');
    await resultElement.waitForDisplayed({ timeout: 5000 });
    const resultNumber = + (await resultElement.getText());

    assert.strictEqual(resultNumber, (NUMBER_7 + NUMBER_8), `❌ Ожидали результат ${NUMBER_7 + NUMBER_8}`);

    // Save resource code in XML if needed:
    // const pageSource = await driver.getPageSource();
    // fs.writeFileSync('ui_calculator_15.xml', pageSource);

  } finally {
    await driver.deleteSession();
  }
}

runTest().catch(console.error);
