import react from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function Task(props) {
    const [isChecked, setIsChecked] = react.useState(false);

    const checkboxToggleHandler = () => {
        setIsChecked(!isChecked);
    };
    
    return (
        <View>
            <TouchableOpacity style={styles.item} onPress={checkboxToggleHandler}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* Apply color based on isChecked state */}
                    <View style={[
                        styles.square,
                        isChecked && { opacity: 1 }  // Full opacity when checked
                    ]}></View>
                    <Text style={[
                        styles.TaskTitle,
                        isChecked && { textDecorationLine: 'line-through', color: '#999' }  // Strike-through when checked
                    ]}>
                        {props.title}
                    </Text>
                </View>
                {/* Checkbox color changes based on state */}
                <View style={[
                    styles.checkbox,
                    isChecked && { backgroundColor: '#000000', borderColor: '#000000' }
                ]} />
            </TouchableOpacity>
        </View>
    );
}

export default Task;

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 20,
        elevation: 2,
        flexWrap: 'wrap',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        justifyContent: 'space-between',
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#000000',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    TaskTitle: {
        fontSize: 16,
        color: '#000000',
    },
    checkbox: {
        width: 12,
        height: 12,
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 5, // ✅ This is correct
    },
});