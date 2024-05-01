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
    <View className="flex-1 bg-black p-4 justify-center pt-12">
      <Text className="font-bold text-center mb-6 bg-green-700 pt-4 pb-4 text-3xl">Poker Pot Tracker</Text>
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 mr-2 bg-white border border-gray-300 rounded p-2"
          placeholder="Player Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="flex-1 bg-white border border-gray-300 rounded p-2"
          placeholder="Buy In"
          keyboardType="numeric"
          value={buyIn}
          onChangeText={setBuyIn}
        />
        </View>
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded mb-4 items-center"
          onPress={addPlayer}
        >
        <Text className="text-white font-semibold">Add Player</Text>
        </TouchableOpacity>
        <FlatList
          data={players}
          renderItem={({ item, index }) => (
        <View className="p-3 bg-white mb-2 rounded shadow">
        <Text className="font-semibold">{item.name} - In for: ${item.buyIn.toFixed(2)}</Text>
        <View className="flex-row justify-between mt-2">
        <View className="flex-1 mr-2">
        <TextInput
          className="bg-white border border-gray-300 rounded p-2 mb-2"
          placeholder="Add-on $"
          keyboardType="numeric"
          value={addOnAmounts[item.name]}
          onChangeText={(text) => handleAddOnChange(item.name, text)}
        />
        <TouchableOpacity
          className="bg-green-500 p-2 rounded"
          onPress={() => handleAddOn(item.name, addOnAmounts[item.name])}
        >
        <Text className="text-white">Add-on</Text>
        </TouchableOpacity>
        </View>
        <View className="flex-1 ml-2">
          <TextInput
            className="bg-white border border-gray-300 rounded p-2 mb-2"
            placeholder="Cash Out $"
            keyboardType="numeric"
            value={cashOutAmounts[item.name]}
            onChangeText={(text) => handleCashOutAmountChange(item.name, text)}
          />
          <TouchableOpacity
            className="bg-red-500 p-2 rounded"
            onPress={() => cashOutPlayer(index)}
          >
          <Text className="text-white">Cash Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="bg-orange-500 p-2 rounded mt-2"
        onPress={() => removePlayer(index)}
      >
        <Text className="text-white">Busted?</Text>
      </TouchableOpacity>
    </View>
  )}
  keyExtractor={(item, index) => index.toString()}
  />
      <Text className="text-center font-bold text-xl bg-green-700 pt-8 pb-8 text-3xl">Total Pot: ${potTotal.toFixed(2)}</Text>
    </View>
  );
};
export default App;
