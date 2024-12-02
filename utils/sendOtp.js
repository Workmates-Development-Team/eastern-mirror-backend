import { PinpointClient, SendMessagesCommand } from "@aws-sdk/client-pinpoint";

const client = new PinpointClient({ region: process.env.AWS_REGION });

export default async function sendOTPSMS(phoneNumber, otp) {
  console.log(phoneNumber);
  console.log(otp);
  const params = {
    ApplicationId: process.env.PINPOINT_ID,
    MessageRequest: {
      Addresses: {
        [phoneNumber]: {
          ChannelType: "SMS",
        },
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: `Your OTP code is: ${otp}`,
          MessageType: "TRANSACTIONAL",
        },
      },
    },
  };

  try {
    const command = new SendMessagesCommand(params);
    const response = await client.send(command);
    console.log("Message sent! Response:", response);
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

export const getOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
