import { NextApiRequest, NextApiResponse } from "next";
import firebase from "config/firebase";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { user } = req.query;

  if (method != "GET") {
    res.status(400).send("Invalid Request");
    return;
  }

  if (!user) {
    res.status(403).send({
      status: 403,
    });
    return;
  }
  const userRef = firebase.firestore().collection("user").doc(user.toString().toLowerCase());

  const nonce = Math.floor(Math.random() * 1000000);

  const checkUser = await (await userRef.get()).data();

  if (checkUser) {
    res.status(200).send({
      status: 200,
      nonce: checkUser.nonce,
    });
    return;
  }

  await userRef.create({
    walletAddress: user,
    nonce: nonce,
  });

  res.status(200).send({
    status: 200,
    nonce: nonce,
  });
  return;
}
