import { useState, useEffect } from 'react'
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  ScrollView, TextInput, Dimensions, SafeAreaView 
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'

const { width } = Dimensions.get('window')

// Home Screen
function HomeScreen({ navigation }) {
  const modules = [
    { name: 'Identity', icon: '👤', color: '#10b981', progress: 75 },
    { name: 'Wellness', icon: '🌿', color: '#22c55e', progress: 100 },
    { name: 'Emotional', icon: '💚', color: '#16a34a', progress: 60 },
    { name: 'Recovery', icon: '🔋', color: '#f59e0b', progress: 45 },
    { name: 'Sensory', icon: '👁️', color: '#06b6d4', progress: 30 },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.subtitle}>Your OS is running at 62%</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🔥 5</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>😊 7.5</Text>
            <Text style={styles.statLabel}>Avg Mood</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>⚡ 6.8</Text>
            <Text style={styles.statLabel}>Energy</Text>
          </View>
        </View>

        {/* Module Grid */}
        <Text style={styles.sectionTitle}>Modules</Text>
        <View style={styles.moduleGrid}>
          {modules.map((module) => (
            <TouchableOpacity 
              key={module.name} 
              style={[styles.moduleCard, { borderColor: module.color }]}
              onPress={() => navigation.navigate('Module', { name: module.name })}
            >
              <Text style={styles.moduleIcon}>{module.icon}</Text>
              <Text style={styles.moduleName}>{module.name}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${module.progress}%`, backgroundColor: module.color }
                  ]} 
                />
              </View>
              <Text style={styles.moduleProgress}>{module.progress}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Prompt */}
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>✨ Daily Prompt</Text>
          <Text style={styles.promptText}>What are you grateful for today?</Text>
          <TouchableOpacity style={styles.promptButton}>
            <Text style={styles.promptButtonText}>Reflect</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Module Detail Screen
function ModuleScreen({ route }) {
  const { name } = route.params
  const [input, setInput] = useState('')

  const exercises = [
    { title: 'Values Clarification', duration: '15 min', completed: true },
    { title: 'Purpose Discovery', duration: '20 min', completed: false },
    { title: 'Vision Board', duration: '30 min', completed: false },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{name}</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.exerciseList}>
          {exercises.map((ex, i) => (
            <View key={i} style={styles.exerciseCard}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>{ex.title}</Text>
                <Text style={styles.exerciseDuration}>{ex.duration}</Text>
              </View>
              <TouchableOpacity style={[
                styles.exerciseButton,
                ex.completed && styles.completedButton
              ]}>
                <Text style={styles.exerciseButtonText}>
                  {ex.completed ? '✓ Done' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Log */}
        <View style={styles.quickLog}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          <TextInput
            style={styles.input}
            placeholder="How are you feeling?"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.logButton}>
            <Text style={styles.logButtonText}>Log Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Wellness Screen
function WellnessScreen() {
  const [wellness, setWellness] = useState({
    sleep: '', energy: '', mood: '', water: ''
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>🌿 Wellness Log</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.wellnessForm}>
          <Text style={styles.formLabel}>Sleep (hours)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={wellness.sleep}
            onChangeText={(t) => setWellness({...wellness, sleep: t})}
            placeholder="7.5"
          />

          <Text style={styles.formLabel}>Energy (1-10)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={wellness.energy}
            onChangeText={(t) => setWellness({...wellness, energy: t})}
            placeholder="7"
          />

          <Text style={styles.formLabel}>Mood (1-10)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={wellness.mood}
            onChangeText={(t) => setWellness({...wellness, mood: t})}
            placeholder="8"
          />

          <Text style={styles.formLabel}>Water (ml)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={wellness.water}
            onChangeText={(t) => setWellness({...wellness, water: t})}
            placeholder="2500"
          />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Profile Screen
function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
        <Text style={styles.profileName}>Don Qui</Text>
        <Text style={styles.profileSubtitle}>Your AI Assistant</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileStats}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>47</Text>
            <Text style={styles.profileStatLabel}>Entries</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>10</Text>
            <Text style={styles.profileStatLabel}>Modules</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>5</Text>
            <Text style={styles.profileStatLabel}>Day Streak</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionText}>📊 Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionText}>⚙️ Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionText}>📤 Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileOption}>
          <Text style={styles.profileOptionText}>🔔 Notifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1e293b',
            borderTopColor: '#334155',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#8b5cf6',
          tabBarInactiveTintColor: '#64748b',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{fontSize: 24}}>🏠</Text> }}
        />
        <Tab.Screen 
          name="Wellness" 
          component={WellnessScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{fontSize: 24}}>🌿</Text> }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{fontSize: 24}}>👤</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    width: (width - 48) / 3,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moduleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    width: (width - 48) / 2 - 4,
    marginBottom: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  moduleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  moduleProgress: {
    fontSize: 12,
    color: '#94a3b8',
  },
  promptCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  promptLabel: {
    fontSize: 14,
    color: '#8b5cf6',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  promptButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  exerciseList: {
    marginBottom: 24,
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  exerciseButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completedButton: {
    backgroundColor: '#22c55e',
  },
  exerciseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  quickLog: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    color: '#f8fafc',
    marginBottom: 12,
    minHeight: 80,
  },
  logButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  wellnessForm: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  profileOption: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  profileOptionText: {
    fontSize: 16,
    color: '#f8fafc',
  },
})
