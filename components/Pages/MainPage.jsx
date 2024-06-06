import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState} from "react";
import { Button, StyleSheet, Text, TextInput, View} from "react-native";
import { Pressable } from "react-native";
import db from "../../services/firebase/config";

export const MainPage = () => {

    const [text, setText] = useState('');
    const [limit, setLimit] = useState(10);
    const [passArr, setPassArr] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const passSym = 'qwertyuiopasdfghjklzxcvbnm1234567890!@$_'
    const generatePass = async () => {
        setIsLoad(false);

        let currentTimestamp = getCurrentTimestamp();

        let res = '';
        for (let i = 0, len = passSym.length; i < limit; ++i) {
            res += passSym.charAt(Math.floor(Math.random() * len))
        }
        if (res[0] == '!' || res[0] == '@' || res[0] == '$' || res[0] == '_') {
            generatePass()
        } else {
            setText(res)
        }

        const addRef = await addDoc(collection(db, "passwords"), {
            password: res,
            updatedAt: currentTimestamp
        }).then(() => {
            getDB().then(() => setIsLoad(true));
        })
    }

    const genPass = () => {
        let res = '';
        for (let i = 0, len = passSym.length; i < limit; ++i) {
            res += passSym.charAt(Math.floor(Math.random() * len))
        }
        
        if (res[0] == '!' || res[0] == '@' || res[0] == '$' || res[0] == '_') {
            res = genPass()
        }

        return res;
    }

    const getCurrentTimestamp = () => {
        var currentDate = new Date();
        currentDate.toLocaleString("en-US", {timeZone: "Europe/Moscow"});
        var currentMoscowTime = currentDate.toLocaleString();

        // console.log(currentMoscowTime);

        return currentMoscowTime;
    }

    const getDB = async () => {
        const arr = [];
        const getCollection = await getDocs(collection(db, "passwords"))
        await getCollection.forEach((doc) => {
            arr.push({id: doc.id, pass: doc.data().password})
        })
        await setPassArr(arr);
    }
    useEffect(() => {
        getDB().then(() => {
            setIsLoad(true);
        })
    }, [])

    const DeletePass = async (id) => {
        await setIsLoad(false);
        await deleteDoc(doc(db, "passwords", id));
        await getDB().then(() => {
            setIsLoad(true);
        })
    }

    const UpdatePass = (id) => {
        if(id) {
            setIsLoad(false);

            let currentTimestamp = getCurrentTimestamp();

            const docRef =  doc(db, 'passwords', id);
            const newPass = genPass();

            const newPassDoc = {password: newPass, updatedAt: currentTimestamp};

            updateDoc(docRef, newPassDoc)
                .then(() => {getDB().then(() => setIsLoad(true))});
        } 
    }

  return (
    <View style={stylePage.page}>
        {
            !isLoad ? (
                <Text style={stylePage.text}>Load</Text>
            ) : (
                <>
                    <Text style={stylePage.pageHeader}>Pass generator</Text>
                    <View style={stylePage.passwordGenerationSection}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={stylePage.text}>Pass length</Text>
                            <TextInput keyboardType="numeric" value={limit} onChangeText={setLimit} style={stylePage.passLenInput} />
                        </View>
                        <TextInput value={text} onChangeText={setText} style={{...stylePage.input, textAlign: 'center', alignSelf: 'center', marginTop: 5}} />
                        {/* <Button style={{display: 'flex', alignSelf: 'center'}} onPress={generatePass} title="gen" /> */}
                        <Pressable style={stylePage.genPassButton} onPress={generatePass}>
                            <Text style={{color: "white", fontWeight: 500}}>GENERATE</Text>
                        </Pressable>
                    </View>
                    <View style={stylePage.passHistoryItemsContainer}>
                        <Text style={stylePage.passHistoryHeaderText}>History</Text>
                        {
                            passArr.map((data) => (
                                // <>
                                    <View key={data.id} style={stylePage.passHistoryItemContainer}>
                                        <Text  style={{...stylePage.text, marginBottom: 10}}>{data.pass}</Text>

                                        <View style={stylePage.passHistoryItem}>
                                            <Button onPress={() => DeletePass(data.id)} title="Delete" />
                                            <Button onPress={() => UpdatePass(data.id)} title="Update" />
                                        </View>
                                    </View>
                                // </>
                            ))
                        }
                    </View>
                </>
            )
        }
    </View>
  )
}

const stylePage = StyleSheet.create({
    page: {
        width: '100vw',
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    passwordGenerationSection: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 15,
        padding: 15,
        marginBottom: 7,
        borderRadius: 5,
        backgroundColor: "#2a4478",
    },
    passHistoryHeaderText: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',
        marginBottom: 15
    },
    genPassButton: {
        alignSelf: 'center',
        color: 'white',
        backgroundColor: '#2f9ceb',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        borderRadius: 2,
        margin: 10
    },
    text: {
        color: 'white',
        alignSelf: "center",
        textAlign: 'center'
    },
    pageHeader: {
        color: 'white',
        fontSize: 20,
        margin: 15
    },
    input: {
        color: 'white'
    },
    passLenInput: {
        color: 'white',
        maxWidth: 100,
        marginLeft: 10,
        textAlign: "right",
        paddingStart: 3,
        paddingEnd: 3
    },
    passHistoryItem: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-between',
        marginBottom: 10
    },
    passHistoryItemsContainer: {
        display: 'flex'
    },
    passHistoryItemContainer: {
        backgroundColor: "#2a4478",
        display: 'flex',
        justifyContent: 'flex-start',
        minWidth: 200,
        padding: 15,
        marginBottom: 7,
        borderRadius: 5
    }
});