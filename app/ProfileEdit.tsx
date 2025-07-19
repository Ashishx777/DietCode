import { AuthContext } from '@/components/auth/AuthContext';
import type { Profile } from '@/components/auth/ProfileContext';
import { ProfileContext } from '@/components/auth/ProfileContext';
import { PROFILE_PIC_MAP, ProfilePicKey } from '@/constants/profilePicMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, Edit3, Search } from 'lucide-react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Country,
  CountryCode,
  FlagType,
  getAllCountries,
} from 'react-native-country-picker-modal';

const allowedPics: ProfilePicKey[] = [
  'pic1',
  'pic2',
  'pic3',
  'pic4',
  'pic5',
  'pic6',
  'pic7',
  'pic8',
  'pic9',
  'pic10',
  'pic11',
  'pic12',
];

export default function ProfileEdit() {
  const { userData, setUserData } = useContext(AuthContext);
  const { profile, updateProfile } = useContext(ProfileContext);
  const router = useRouter();

  const [countryCode] = useState<CountryCode>(
    (profile?.countryCode as CountryCode) || 'IN'
  );
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [picModalVisible, setPicModalVisible] = useState(false);
  const [, setCountry] = useState<Country | null>(null);

  const [form, setForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    username: profile?.username || '',
    gender: profile?.gender || '',
    dob: profile?.dob || { month: 'Jan', day: 1, year: 2000 },
    country: typeof profile?.country === 'string' ? profile.country : '',
    profilePic: profile?.profilePic || 'pic9',
  });

  useFocusEffect(
    useCallback(() => {
      if (profile) {
        setForm((prev) => ({
          ...prev,
          gender: profile.gender || '',
          profilePic: profile.profilePic,
        }));
      }
    }, [profile])
  );

  useEffect(() => {
    const loadCountries = async () => {
      const countries = await getAllCountries(FlagType.EMOJI);
      setAllCountries(countries);
      setFilteredCountries(countries);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCountries(allCountries);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredCountries(
        allCountries.filter((c) => {
          const name =
            typeof c.name === 'string' ? c.name : c.name?.common ?? '';
          return name.toLowerCase().includes(q);
        })
      );
    }
  }, [searchQuery, allCountries]);

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    const validatedGender: 'male' | 'female' | '' =
      form.gender === 'male' || form.gender === 'female' ? form.gender : '';

    const fallbackDOB = { month: 'Jan', day: 1, year: 2000 };

    const updatedProfile: Profile = {
      name: form.name,
      email: form.email,
      username: form.username,
      gender: validatedGender,
      dob:
        typeof form.dob === 'object' && form.dob !== null
          ? form.dob
          : fallbackDOB,
      country: form.country,
      countryCode: countryCode,
      profilePic: allowedPics.includes(form.profilePic as ProfilePicKey)
        ? (form.profilePic as ProfilePicKey)
        : 'pic9',
    };

    updateProfile(updatedProfile);
    router.back();
  };
  const onSelectCountry = async (item: Country) => {
    const countryName =
      typeof item.name === 'string' ? item.name : item.name?.common ?? '';

    setCountry(item);
    setCountryPickerVisible(false);

    setUserData({
      ...userData,
      country: countryName,
      countryCode: item.cca2,
    });

    await AsyncStorage.setItem(
      'userCountry',
      JSON.stringify({
        name: countryName,
        code: item.cca2,
      })
    );

    if (profile) {
      updateProfile({
        name: profile.name ?? '',
        dob: profile.dob ?? '',
        gender: profile.gender ?? '',
        profilePic: profile.profilePic,
        country: countryName,
        countryCode: item.cca2,
        username: '',
        email: '',
      });
    }

    setForm((prevForm) => ({
      ...prevForm,
      country: countryName,
    }));
  };

  const flagUri = (code?: string) =>
    code ? `https://flagcdn.com/w320/${code.toLowerCase()}.png` : '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={26} color="#111" />
        </Pressable>
        <Text style={styles.pageTitle}>Edit Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileImageWrapper}>
          <Image
            source={PROFILE_PIC_MAP[form.profilePic]}
            style={styles.avatar}
          />
          <Pressable
            style={styles.editIconWrapper}
            onPress={() => setPicModalVisible(true)}
          >
            <Edit3 size={18} color="#fff" />
          </Pressable>
        </View>

        <Input
          label="Name"
          value={form.name}
          onChangeText={(v) => handleChange('name', v)}
        />
        <Input
          label="Email Address"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
        />
        <Input
          label="Username"
          value={form.username}
          onChangeText={(v) => handleChange('username', v)}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <Pressable
          onPress={() => router.push('/auth/dobchange')}
          style={styles.dobInput}
        >
          <Text style={styles.dobInputText}>
            {form.dob
              ? `${form.dob.day} ${form.dob.month}, ${form.dob.year}`
              : 'Not set'}
          </Text>
        </Pressable>

        <Text style={styles.label}>Country</Text>
        <Pressable
          style={styles.countrySelector}
          onPress={() => setCountryPickerVisible(true)}
        >
          <View style={styles.countryInfo}>
            <Image
              source={{ uri: flagUri(countryCode) }}
              style={styles.flagImage}
            />
            <View style={styles.countryTextContainer}>
              <Text style={styles.countryName}>
                {form.country || 'Select Country'}
              </Text>
            </View>
          </View>
          <ChevronDown size={20} color="#6b7280" style={styles.chevronIcon} />
        </Pressable>

        <Text style={styles.label}>Gender</Text>
        <Pressable
          onPress={() => router.push('/auth/genderchange')}
          style={styles.genderInput}
        >
          <Text style={styles.genderInputText}>
            {form.gender
              ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1)
              : 'Not set'}
          </Text>
        </Pressable>
      </ScrollView>

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </Pressable>

      <Modal visible={picModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Choose your profile pic</Text>
            <View style={styles.pickerGrid}>
              {allowedPics.map((pic) => (
                <Pressable
                  key={pic}
                  style={[
                    styles.picOption,
                    form.profilePic === pic && styles.picOptionSelected,
                  ]}
                  onPress={() => handleChange('profilePic', pic)}
                >
                  <Image
                    source={PROFILE_PIC_MAP[pic]}
                    style={styles.picImage}
                  />
                </Pressable>
              ))}
            </View>
            <Pressable
              style={styles.button}
              onPress={() => setPicModalVisible(false)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </Modal>

      {countryPickerVisible && (
        <Modal
          animationType="slide"
          visible={countryPickerVisible}
          onRequestClose={() => setCountryPickerVisible(false)}
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <View style={styles.pickerTitleGroup}>
                  <Text style={styles.pickerTitleTop}>Please Select</Text>
                  <Text style={styles.pickerTitleBottom}>your country</Text>
                </View>
                <Pressable onPress={() => setCountryPickerVisible(false)}>
                  <Text style={styles.pickerCloseText}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.searchBarContainer}>
                <Search size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search country..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>

              <FlatList
                data={filteredCountries}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.cca2}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.countryItem}
                    onPress={() => onSelectCountry(item)}
                  >
                    <View style={styles.countryItemLeft}>
                      <Image
                        source={{ uri: flagUri(item.cca2) }}
                        style={styles.flagImage}
                      />
                      <Text style={styles.countryItemText}>
                        {typeof item.name === 'string'
                          ? item.name
                          : item.name?.common ?? ''}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

function Input({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  profileImageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#333',
    borderRadius: 14,
    padding: 6,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#222',
    paddingVertical: 20,
    paddingHorizontal: '30%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
    marginVertical: 10,
  },
  picOption: {
    padding: 3,
    borderRadius: 999,
  },
  picOptionSelected: {
    borderWidth: 3,
    borderColor: '#ddd',
    backgroundColor: '#222',
    borderRadius: 999,
  },
  picImage: {
    width: 70,
    height: 70,
    borderRadius: 999,
  },
  pickerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    marginHorizontal: 10,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 15,
  },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 14, color: '#555', marginBottom: 8, marginLeft: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
    marginLeft: 10,
  },
  genderInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 18,
    marginBottom: 10,
  },
  genderInputText: { fontSize: 16, color: '#222', marginLeft: 10 },
  dobInput: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  dobInputText: { fontSize: 16, color: '#222', marginLeft: 10 },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 999,
    padding: 12,
    alignItems: 'center',
    minHeight: 38,
    marginBottom: 10,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  flagImage: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  countryTextContainer: { marginLeft: 12 },
  countryName: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  chevronIcon: { marginTop: 2, paddingHorizontal: 20 },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pickerTitleGroup: {
    marginBottom: 2,
    marginLeft: 8,
  },
  pickerTitleTop: {
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
    marginBottom: -6,
  },
  pickerTitleBottom: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
  },

  pickerCloseText: {
    fontSize: 28,
    color: '#888',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});
