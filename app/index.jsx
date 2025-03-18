import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, Button, StyleSheet, Alert, 
  AppState, BackHandler, ScrollView, Dimensions
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const originalQuestions = [
  {
    question: "A train 180 meters long is running at a speed of 54 km/h. How long will it take to cross a platform 120 meters long?",
    options: [
      "10 sec",
      "12 sec",
      "15 sec",
      "20 sec"
    ],
    answer: "20 sec"
  },
  {
    question: "The ratio of the ages of A and B is 3:5. If A is 15 years old, how old is B?",
    options: [
      "20",
      "25",
      "30",
      "35"
    ],
    answer: "25"
  },
  {
    question: "A student scores 75 marks in an exam and this is 60% of the total marks. What are the maximum marks?",
    options: [
      "110",
      "120",
      "125",
      "150"
    ],
    answer: "125"
  },
  {
    question: "A shopkeeper marks an article 50% above the cost price and allows a discount of 20%. What is the profit percentage?",
    options: [
      "20%",
      "25%",
      "30%",
      "40%"
    ],
    answer: "20%"
  },
  {
    question: "What is the simple interest on Rs. 5000 at a rate of 8% per annum for 2 years?",
    options: [
      "Rs. 400",
      "Rs. 500",
      "Rs. 800",
      "Rs. 1000"
    ],
    answer: "Rs. 800"
  },
  {
    question: "Find the compound interest on Rs. 10,000 at 10% per annum for 2 years.",
    options: [
      "Rs. 1000",
      "Rs. 2000",
      "Rs. 2100",
      "Rs. 2200"
    ],
    answer: "Rs. 2100"
  },
  {
    question: "The LCM of two numbers is 60 and their HCF is 5. If one number is 20, what is the other number?",
    options: [
      "10",
      "15",
      "30",
      "40"
    ],
    answer: "15"
  },
  {
    question: "The average age of 5 people is 25 years. If one new person joins the group, and the new average becomes 27, what is the age of the new person?",
    options: [
      "32",
      "35",
      "37",
      "40"
    ],
    answer: "37"
  },
  {
    question: "A and B together can complete a work in 12 days. A alone can do it in 20 days. How long will B alone take to do the same work?",
    options: [
      "15 days",
      "24 days",
      "30 days",
      "40 days"
    ],
    answer: "30 days"
  },
  {
    question: "A boat takes 6 hours to travel 36 km downstream and 12 hours to return upstream. Find the speed of the stream.",
    options: [
      "1 km/h",
      "1.5 km/h",
      "3 km/h",
      "4 km/h"
    ],
    answer: "1.5 km/h"
  },
  {
    question: "Find the missing number: 3, 9, 27, ?, 243",
    options: [
      "54",
      "81",
      "108",
      "121"
    ],
    answer: "81"
  },
  {
    question: "A box contains 5 red balls and 3 blue balls. One ball is drawn at random. What is the probability of getting a red ball?",
    options: [
      "3/8",
      "5/8",
      "2/5",
      "3/5"
    ],
    answer: "5/8"
  },
  {
    question: "How many different ways can the letters of the word 'RING' be arranged?",
    options: [
      "12",
      "16",
      "24",
      "32"
    ],
    answer: "24"
  },
  {
    question: "The area of a circle is 154 cm². Find its radius (Take π = 3.14).",
    options: [
      "5 cm",
      "6 cm",
      "7 cm",
      "8 cm"
    ],
    answer: "7 cm"
  },
  {
    question: "If log₂ 16 = x, find the value of x.",
    options: [
      "2",
      "3",
      "4",
      "5"
    ],
    answer: "4"
  }
];








// Function to shuffle array
const shuffleArray = (array) => {
  let shuffled = [...array]; // Create a copy of the array
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


export default function QuizApp() {
  const [screen, setScreen] = useState('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [internetAccess, setInternetAccess] = useState(false);
  const [answers, setAnswers] = useState({});
  
 
const [questions, setQuestions] = useState([]); // Initialize empty

useEffect(() => {
  setQuestions(shuffleArray(originalQuestions)); // Shuffle on mount
}, []);


const [attempted, setAttempted] = useState(false);

// Check if user has already attempted the quiz
useEffect(() => {
  const checkAttempt = async () => {
    //await AsyncStorage.removeItem('quizAttempted');
    //await AsyncStorage.removeItem('score');
    const storedAttempt = await AsyncStorage.getItem('quizAttemptedforOOPS');
 
    if (storedAttempt=='true') {
      const storedscore = await AsyncStorage.getItem('score');
      
      setAttempted(true); 
      setScore(parseInt(storedscore, 10));
      setScreen('result');
      
    }     
  };
  checkAttempt();
}, []);



  useEffect(() => {
  if (screen === 'result') {
    AsyncStorage.setItem('quizAttemptedforOOPS', 'true');
    AsyncStorage.setItem('score', score.toString());
    console.log("Final Score Stored:", score);
  }
}, [score, screen]); // Dependencies

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active" && screen === "quiz") {
        setScreen("result");
      } else if (appState.current === "active" && nextAppState.match(/inactive|background/) && screen === "quiz") {
        setScreen("result");
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [screen]);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setInternetAccess(state.isConnected);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setInternetAccess(true);
        if (screen === 'quiz') {
          Alert.alert("Internet Detected", "Test ended due to internet access.", [
            { text: "OK", onPress: () => setScreen('result') }
          ]);
        }
      } else {
        setInternetAccess(false);
      }
    });

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen === "quiz") {
        Alert.alert("Warning", "You cannot leave the quiz!", [{ text: "OK" }]);
        return true;
      }
      return false;
    });

    return () => {
      unsubscribeNetInfo();
      backHandler.remove();
    };
  }, [screen]);

  const handleStart = () => {
    if (!internetAccess) {
      setScreen('quiz');
    } else {
      Alert.alert("Turn Off Internet", "Please disable the internet to start the quiz.");
    }
  };

   const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    const updatedAnswers = { ...answers, [currentQuestion]: selectedOption };
    setAnswers(updatedAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(updatedAnswers[currentQuestion + 1] || null);
    } else {
      let finalScore = 0;
      questions.forEach((q, index) => {
        if (updatedAnswers[index] === q.answer) {
          finalScore++;
        }
      });
      setScore(finalScore);
      setScreen('result');
      
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || null);
    }
  };

  return (
    <View style={styles.container}>
      {screen === 'home' && (
        <>
          {internetAccess && <Text style={styles.warning}>Turn off the internet to continue.</Text>}
          <Button title="Start Quiz" onPress={handleStart} />
        </>
      )}
      
      {screen === 'quiz' && (
        <View style={styles.quizContainer}>
          {/* Question Section (60% height, scrollable if needed) */}
          <ScrollView style={styles.questionContainer} >
            <Text style={styles.question}>{`${currentQuestion + 1}. ${questions[currentQuestion].question}`}</Text>
          </ScrollView>

          {/* Options Section (35% height, fits within block) */}
          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.option, selectedOption === option && styles.selectedOption]}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.optionText} numberOfLines={3} adjustsFontSizeToFit>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Next Button (5% height) */}
          <View style={styles.buttonContainer}>
            {currentQuestion != 0 && <Button title="Prev" onPress={handlePrev} />}
            <Button title={currentQuestion===(questions.length-1)?"Submit ":"Next"} onPress={handleNext} disabled={!selectedOption} />
          </View>
        </View>
      )}

      {screen === 'result' && <Text style={styles.result}>Your Score {"for Apti"}: {score}</Text>}
    </View>
  );
}
/*

const styles = StyleSheet.create({
  container: {
    display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center',height:"100%", marginTop: '5%', 
 marginBottom: "10%"
  },
  quizContainer: { display:"flex",flexDirection:"column", width: '90%',height:"100%",justifyContent: "center" },
  
  questionContainer: { 
   maxHeight:"50%",
     // 60% of the screen height
    backgroundColor: '#f9f9f9',
    //padding: 2,
    borderRadius: 8,
   
    //marginBottom: 10,
  },
  
  question: { 
    
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center',
    

   
    
  },
  
  optionsContainer: { 
    height: "40%", // 35% of the screen height
    display: "flex",
    flexDirection:"column",
    justifyContent: 'center',
  },
  
  option: { 

    padding: 12, 
    height:80 ,
    marginVertical: 5, 
    backgroundColor: '#ccc', 
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent:'center'
  },
  selectedOption: { 
    backgroundColor: 'lightblue' 
  },

  optionText: { 
    fontSize: 18, 
    textAlign: 'center', 
  },

  buttonContainer: { 
    display: 'flex',
    flexDirection: "row", 
    columnGap:"5%",
    height:"10%", // 5% of the screen height
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  result: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginTop: 20 
  },

  warning: { 
    fontSize: 16, 
    color: 'red', 
    marginBottom: 10 
  }
});

*/

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: height * 0.05,  // 5% top padding
  },

  quizContainer: { 
    flex: 1, 
    width: '90%', 
    justifyContent: 'center',
  },

  questionContainer: { 
    maxHeight: height * 0.5, // 50% of screen height
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },

  question: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    paddingBottom:40
  },

  optionsContainer: { 
    height: height * 0.40, // 35% of screen height
    justifyContent: 'center',
  },

  option: { 
    //padding: 1, 
    height:60,
    marginVertical: 5, 
    backgroundColor: '#ccc', 
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedOption: { 
    backgroundColor: 'lightblue',
  },

  optionText: { 
    fontSize: 18, 
    textAlign: 'center',
  },

  buttonContainer: { 
    
    flexDirection: "row", 
    justifyContent: 'center',
    columnGap:30,
    alignItems: 'center',
    marginTop: 10,
  },

  result: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginTop: 20,
    textAlign: 'center',
  },

  warning: { 
    fontSize: 16, 
    color: 'red', 
    marginBottom: 10, 
    textAlign: 'center',
  },
});

