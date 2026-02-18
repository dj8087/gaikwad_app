import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import Slider from '@react-native-community/slider';
import useAppNavigation from '../hooks/useAppNavigation';
import useAppDispatch from '../hooks/useAppDispatch';
import {useAuthData} from '../hooks/useAuthData';
import { useSelector } from 'react-redux';
import { fetchCategories } from '../api/categorySlice';
import { RootState } from '../redux/store';
// import useAuthData from '../hooks/useAuthData';

const DropdownModal = ({ visible, items, onSelect, onClose }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => {
                                onSelect(item);
                                onClose();
                            }}
                        >
                            <Text>{item.name || item}</Text>
                        </TouchableOpacity>
                    )}
                />
                <AppButton title="Close" onPress={onClose} />
            </View>
        </View>
    </Modal>
);

const FilterScreen = () => {
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const { token } = useAuthData();
    const { categories, loading, error } = useSelector((state: RootState) => state.category);

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<any>('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>('All');
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [minWeight, setMinWeight] = useState(1);
    const [maxWeight, setMaxWeight] = useState(30);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const [isSubCategoryModalVisible, setSubCategoryModalVisible] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch(fetchCategories({ token }));
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (selectedCategory && selectedCategory !== 'All' && selectedCategory.subCat) {
            setSubCategories(selectedCategory.subCat);
        } else {
            setSubCategories([]);
        }
        setSelectedSubCategory('All');
    }, [selectedCategory]);

    const renderDropdown = (label, selectedValue, onPress) => (
        <View style={styles.filterSection}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.dropdown} onPress={onPress}>
                <Text>{selectedValue?.name || selectedValue}</Text>
                <Ionicons name="chevron-down" size={20} color="black" />
            </TouchableOpacity>
        </View>
    );

    const handleApplyFilters = () => {
        navigation.navigate('FilteredProducts', {
            category: selectedCategory === 'All' ? undefined : selectedCategory.id,
            subCategory: selectedSubCategory === 'All' ? undefined : selectedSubCategory.id,
            weightRangeStart: minWeight,
            weightRangeEnd: maxWeight,
        });
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>Filters</Text>

                <View style={styles.filterSection}>
                    <Text style={styles.label}>Search</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter search query..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {loading && <ActivityIndicator size="large" color="#0000ff" />}
                {error && <Text>Error fetching categories: {error}</Text>}
                {!loading && !error && (
                    <>
                        {renderDropdown('Category', selectedCategory, () => setCategoryModalVisible(true))}
                        {renderDropdown('Sub Category', selectedSubCategory, () => setSubCategoryModalVisible(true))}
                    </>
                )}

                <DropdownModal
                    visible={isCategoryModalVisible}
                    items={['All', ...categories]}
                    onSelect={setSelectedCategory}
                    onClose={() => setCategoryModalVisible(false)}
                />

                <DropdownModal
                    visible={isSubCategoryModalVisible}
                    items={['All', ...subCategories]}
                    onSelect={setSelectedSubCategory}
                    onClose={() => setSubCategoryModalVisible(false)}
                />

                <View style={styles.filterSection}>
                    <Text style={styles.label}>Weight Range (in gms)</Text>
                    <View style={styles.sliderContainer}>
                        <Text>Min: {minWeight.toFixed(0)}g</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={1}
                            maximumValue={30}
                            step={1}
                            value={minWeight}
                            onValueChange={(value) => {
                                if (value < maxWeight) {
                                    setMinWeight(value);
                                }
                            }}
                        />
                    </View>
                    <View style={styles.sliderContainer}>
                        <Text>Max: {maxWeight.toFixed(0)}g</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={1}
                            maximumValue={30}
                            step={1}
                            value={maxWeight}
                            onValueChange={(value) => {
                                if (value > minWeight) {
                                    setMaxWeight(value);
                                }
                            }}
                        />
                    </View>
                </View>

                <AppButton title="Apply Filters" onPress={handleApplyFilters} />
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    filterSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    sliderContainer: {
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});


export default FilterScreen;
