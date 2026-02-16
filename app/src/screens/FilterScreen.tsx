import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { categories } from '../data/categories';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import Slider from '@react-native-community/slider';
import useAppNavigation from '../hooks/useAppNavigation';

const subCategories = [
    { id: 1, name: 'Gold' },
    { id: 2, name: 'Diamond' },
];

const FilterScreen = () => {
    const navigation = useAppNavigation();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<any>('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState<any>('All');
    const [minWeight, setMinWeight] = useState(1);
    const [maxWeight, setMaxWeight] = useState(30);

    // TODO: Implement modal for dropdowns
    const renderDropdown = (label, selectedValue, options) => (
        <View style={styles.filterSection}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.dropdown}>
                <Text>{selectedValue.name || selectedValue}</Text>
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

                {renderDropdown('Category', selectedCategory, ['All', ...categories])}
                {renderDropdown('Sub Category', selectedSubCategory, ['All', ...subCategories])}

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
});

export default FilterScreen;
