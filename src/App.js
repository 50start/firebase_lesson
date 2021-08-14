import React, { useState } from "react";
import firebase from "firebase";
import "./App.css";
import { Box, Flex, Stack, Input } from "@chakra-ui/react";
import { PrimaryButton } from "./components/PrimaryButton";

const firebaseConfig = {};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function App() {
  //データーを表示したい時はuseState処理をする　記述する
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [documentId, setDocumentId] = useState("");

  const handleClickFetchButton = async () => {
    // document取得
    // const doc = await db.collection("users").doc("ehcQ7UNUQ9AYVdqSRj57").get();
    // //async awaitを使うとデーター取得を初めに実行される ドキュメント(doc)のフィールド(data)を取得
    // console.log(doc.data());
    // console.log("Fetch Clicked");

    //　collection 取得
    const snapshot = await db.collection("users").get();
    // await data取得を待つ　dataをget出来たら　snapshotに代入
    // snapshot=> 複数のdocが入っている
    const _users = [];
    snapshot.docs.map((doc) => {
      _users.push({
        //１件１件のuser情報取得(doc)を追加
        id: doc.id, //ドキュメントid
        ...doc.data(), //残りのdataはオブジェクトから取得
        // ...doc => 全プロパティ(nameやageなど）と値を展開
      });
    });
    setUsers(_users);
  };
  const onChangeAge = (event) => setAge(event.target.value);
  const onChangeUsername = (event) => setUserName(event.target.value);
  const onChangeDocumentId = (event) => setDocumentId(event.target.value);

  const handleClickAddButton = async () => {
    if (!userName || !age) {
      alert(' "userName" or "age" が空です');
      return;
    }
    const parsedAge = parseInt(age, 10); //文字列を数字型に変える

    if (isNaN(parsedAge)) {
      alert("numberは半角の数値でセットしてください");
      return;
    }
    const obj = { name: userName, age: parsedAge };
    await db.collection("users").add(obj);
    setUserName("");
    setAge("");
    // const snapShot = await ref.get();
    // //getの中にPromise形式でDocumentのdata snapShotのオブジェクトが入る Promise形式のためawaitを使う(データ取得を待つ)
    // const data = snapShot.data();
    // console.log(ref.id, data);
  };

  const handleClickUpdateButton = async () => {
    if (!documentId) {
      alert("documentIdをセットしてください");
      return; //やり直し！！
    }

    const newData = {};
    if (userName) {
      //userNameに値があったら newDataオブジェクトにnameプロパティを追加して値をセット
      newData["name"] = userName;
    }
    if (age) {
      newData["age"] = parseInt(age, 10);
    }

    try {
      await db.collection("users").doc(documentId).update(newData);
      setUserName("");
      setAge("");
      setDocumentId(""); //入力後 InputTextを空にする
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickDeleteButton = () => {
    if (!documentId) {
      alert("documentIdをセットしてください");
      return;
    }

    try {
      db.collection("users").doc(documentId).delete();
      setUserName("");
      setAge("");
      setDocumentId("");
    } catch (error) {
      console.error(error);
    }
  };

  const userListItems = users.map((user) => {
    //users.mapは関数出ないので{ }で囲わない
    return (
      <Stack key={user.id}>
        <Box>ID: {user.id}</Box>
        <Box>name: {user.name}</Box>
        <Box>ID: {user.age}</Box>
      </Stack>
    );
  });

  return (
    <Flex textAlign="center" justify="center">
      <Stack>
        <Box fontSize="xx-large" mb={10}>
          Hello world
        </Box>
        <Box>
          <Input
            type="text"
            id="username"
            value={userName}
            onChange={onChangeUsername}
            h={20}
            placeholder="username"
          />
        </Box>
        <Box>
          <Input
            type="text"
            id="documentId"
            value={documentId}
            onChange={onChangeDocumentId}
            h={20}
            placeholder="documentId"
          />
        </Box>
        <Box>
          <Input
            type="text"
            id="age"
            value={age}
            onChange={onChangeAge}
            h={20}
            placeholder="age"
          />
        </Box>
        <PrimaryButton onClick={handleClickFetchButton}>取得</PrimaryButton>
        <PrimaryButton onClick={handleClickAddButton}>追加</PrimaryButton>
        <PrimaryButton onClick={handleClickUpdateButton}>更新</PrimaryButton>
        <PrimaryButton onClick={handleClickDeleteButton}>削除</PrimaryButton>
        <Stack bg="#F0FFF4" w="xs">
          <Box fontSize="large">{userListItems}</Box>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default App;
