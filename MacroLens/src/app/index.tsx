import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState<any>(null);

  // Pick an image from the photo library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true, // We will send base64 data to our Python backend
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      // Mock analyzing image (we will connect FastAPI + NVIDIA NIM here next!)
      analyzeImage(result.assets[0].base64);
    }
  };

  // Simulated API call to NVIDIA Vision LLM via Python backend
  const analyzeImage = async (base64Image: string | null | undefined) => {
    setLoading(true);
    setNutritionData(null);

    // Simulated network delay
    setTimeout(() => {
      setLoading(false);
      setNutritionData({
        foodName: "Grilled Chicken Bowl",
        calories: 520,
        protein: "45g",
        carbs: "38g",
        fats: "12g",
      });
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>MacroLens AI</Text>
      <Text style={styles.subtitle}>Snap or upload food to extract macros</Text>

      {/* Image Preview Box */}
      <View style={styles.imageCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>No food photo selected</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.scanButton} onPress={pickImage}>
        <Text style={styles.scanButtonText}>Select Food Photo</Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#208AEF" />
          <Text style={styles.loadingText}>
            Analyzing with NVIDIA Vision Model...
          </Text>
        </View>
      )}

      {/* Results Display */}
      {nutritionData && !loading && (
        <View style={styles.resultsCard}>
          <Text style={styles.foodTitle}>{nutritionData.foodName}</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroBox}>
              <Text style={styles.macroValue}>{nutritionData.calories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroValue}>{nutritionData.protein}</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroValue}>{nutritionData.carbs}</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroValue}>{nutritionData.fats}</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0F172A",
    padding: 24,
    alignItems: "center",
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 24,
  },
  imageCard: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1E293B",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#64748B",
    fontSize: 16,
  },
  scanButton: {
    width: "100%",
    backgroundColor: "#208AEF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 10,
    fontSize: 14,
  },
  resultsCard: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  foodTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 16,
    textAlign: "center",
  },
  macroGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroBox: {
    alignItems: "center",
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#38BDF8",
  },
  macroLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
});
