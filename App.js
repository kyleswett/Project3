import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const App = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');
  const [potTotal, setPotTotal] = useState(0);
  const [cashOutAmounts, setCashOutAmounts] = useState({});
  const [addOnAmounts, setAddOnAmounts] = useState({});

  const addPlayer = () => {
    if (!name || !buyIn) return;
    const newPlayer = { name, buyIn: parseFloat(buyIn) };
    setPlayers(currentPlayers => [...currentPlayers, newPlayer]);
    setPotTotal(currentPot => currentPot + parseFloat(buyIn));
    setName('');
    setBuyIn('');
    setCashOutAmounts(currentAmounts => ({...currentAmounts, [newPlayer.name]: ''}));
    setAddOnAmounts(currentAmounts => ({...currentAmounts, [newPlayer.name]: ''}));
  };

  const cashOutPlayer = (index) => {
    const player = players[index];
    const cashOutAmount = parseFloat(cashOutAmounts[player.name] || 0);
    if (!cashOutAmount || isNaN(cashOutAmount) || cashOutAmount <= 0) return;
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
    setPotTotal(currentPot => currentPot - cashOutAmount);
    const {[player.name]: _, ...remainingAmounts} = cashOutAmounts;
    setCashOutAmounts(remainingAmounts);
  };

  const removePlayer = (index) => {
    setPlayers(currentPlayers => currentPlayers.filter((_, i) => i !== index));
  };

  const handleAddOn = (name, addOnAmount) => {
    if (!addOnAmount || isNaN(addOnAmount) || addOnAmount <= 0) return;
    const newAddOnAmount = parseFloat(addOnAmount);
    setPlayers(currentPlayers =>
      currentPlayers.map(player =>
        player.name === name ? { ...player, buyIn: player.buyIn + newAddOnAmount } : player
      )
    );
    setPotTotal(currentPot => currentPot + newAddOnAmount);
    setAddOnAmounts(currentAmounts => ({ ...currentAmounts, [name]: '' }));  // Reset the input field
  };

  const handleCashOutAmountChange = (name, value) => {
    setCashOutAmounts(currentAmounts => ({
      ...currentAmounts,
      [name]: value
    }));
  };

  const handleAddOnChange = (name, value) => {
    setAddOnAmounts(currentAmounts => ({
      ...currentAmounts,
      [name]: value
    }));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Poker Pot Tracker</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, marginRight: 10, borderWidth: 1, padding: 5 }}
          placeholder="Player Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={{ flex: 1, borderWidth: 1, padding: 5 }}
          placeholder="Buy In"
          keyboardType="numeric"
          value={buyIn}
          onChangeText={setBuyIn}
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
          <View style={{ marginBottom: 5 }}>
            <Text>{item.name} - In for: ${item.buyIn.toFixed(2)}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, padding: 5, marginRight: 10 }}
                placeholder="Add-on $"
                keyboardType="numeric"
                value={addOnAmounts[item.name]}
                onChangeText={(text) => handleAddOnChange(item.name, text)}
              />
              <TouchableOpacity
                style={{ backgroundColor: 'green', padding: 5, borderRadius: 5 }}
                onPress={() => handleAddOn(item.name, addOnAmounts[item.name])}
              >
                <Text style={{ color: 'white' }}>Add-on</Text>
              </TouchableOpacity>
              <TextInput
                style={{ flex: 1, borderWidth: 1, padding: 5, marginRight: 10 }}
                placeholder="Cash Out $"
                keyboardType="numeric"
                value={cashOutAmounts[item.name]}
                onChangeText={(text) => handleCashOutAmountChange(item.name, text)}
              />
              <TouchableOpacity
                style={{ backgroundColor: 'red', padding: 5, borderRadius: 5 }}
                onPress={() => cashOutPlayer(index)}
              >
                <Text style={{ color: 'white' }}>Cash Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'orange', padding: 5, borderRadius: 5 }}
                onPress={() => removePlayer(index)}
              >
                <Text style={{ color: 'white' }}>Busted?</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text style={{ marginTop: 20 }}>Total Pot: ${potTotal.toFixed(2)}</Text>
    </View>
  );
};

export default App;
