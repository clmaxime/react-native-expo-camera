import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorche] = useState(false);
  const [codeRead, setReader] = useState(false);
  const [scan, setScan] = useState(false);

  if (!permission) {
    return <Text>Pas de permission</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "right" }}>Permission required</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleTorch() {
    setTorche((current) => (current === false ? true : false));
  }
  function toggleCam() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  function onScan(code) {
    const scannedData = code.data;

    // Vérifie si le code QR contient une URL valide
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?(www\\.)?([\\w\\-\\.]+)+(:\\d+)?(\\/([\\w\\/_\\-\\.]*))*\\/?$",
      "i"
    );

    if (urlPattern.test(scannedData)) {
      Linking.openURL(scannedData).catch((err) =>
        console.error("An error occurred", err)
      );
    } else {
      console.log("Scanned data:", scannedData);
    }

    setScan(true);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.cam}
        facing={facing}
        enableTorch={torch}
        onBarcodeScanned={(code) => onScan(code)}
      >
        <View style={styles.primBtn}>
          <TouchableOpacity style={styles.btn} onPress={toggleTorch}>
            <Text style={styles.txt}>light</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={toggleCam}>
            <Text style={styles.txt}>flip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.secBtn}>
          <TouchableOpacity style={styles.btn} onPress={toggleTorch}>
            <Text style={styles.point}></Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cam: {
    flex: 1,
  },
  primBtn: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    top: 20,
  },
  secBtn: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
  },
  btn: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  txt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  point: {
    border: 20,
    borderWidth: 25,
    borderColor: "red",
  },
});
