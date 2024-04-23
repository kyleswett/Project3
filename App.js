// App.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const App = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');
  const [potTotal, setPotTotal] = useState(0);

  const addPlayer = () => {
    if (!name || !buyIn) return;
    const newPlayer = { name, buyIn: parseFloat(buyIn) };
    setPlayers([...players, newPlayer]);
    setPotTotal(potTotal + parseFloat(buyIn));
    setName('');
    setBuyIn('');
  };

  const deletePlayer = (index) => {
    const updatedPlayers = [...players];
    const deletedBuyIn = updatedPlayers[index].buyIn;
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
    setPotTotal(potTotal - deletedBuyIn);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Poker Pot Tracker</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, marginRight: 10, borderWidth: 1, padding: 5 }}
          placeholder="Player Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={{ flex: 1, borderWidth: 1, padding: 5 }}
          placeholder="Buy In"
          keyboardType="numeric"
          value={buyIn}
          onChangeText={(text) => setBuyIn(text)}
        />
      </View>
      <TouchableOpacity
        style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 5, marginBottom: 10 }}
        onPress={addPlayer}
      >
        <Text style={{ color: 'white' }}>Add Player</Text>
      </TouchableOpacity>
      <FlatList
        data={players}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text>{item.name}</Text>
            <Text>${item.buyIn.toFixed(2)}</Text>
            <TouchableOpacity
              onPress={() => deletePlayer(index)}
              style={{ backgroundColor: 'red', padding: 5, borderRadius: 5 }}
            >
              <Text style={{ color: 'white' }}>Delete</Text>
              
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text style={{ marginTop: 20 }}>Total Pot: ${potTotal.toFixed(2)}</Text>
    </View>
  );
};

export default App;
