using System;
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using Random = System.Random;

public class Tournamentmaker : MonoBehaviour
{
    public GameObject names;

    private Dictionary<int, string> _namesList = new Dictionary<int, string>();

    private List<string[]> _pairings = new List<string[]>();
    private void Start()
    {
        gameObject.GetComponent<Button>().onClick.AddListener(DisplayNames);

        _namesList = names.GetComponent<NameSaver>().namesList;
    }


    void DisplayNames()
    {
        List<int> seats = new List<int>();
        for (int i = 0; i < _namesList.Count; i++)
        {
            seats.Add(i);
        }

        Random rnd = new Random();
        string[] pairs = new string[2];
        int numberOfPlayers = 0;
        int player1;
        int player2;
        while (numberOfPlayers < _namesList.Count)
        {
            if (_namesList.Count % 2 == 1) break;

            //player 1
            player1 = rnd.Next(0, seats.Count);
            if (!seats.Contains(player1)) continue;
            //player 2
            player2 = rnd.Next(0, seats.Count);
            if (!seats.Contains(player2) || player1 == player2) continue;
            seats.Remove(seats.IndexOf(player2));
            seats.Remove(seats.IndexOf(player1));

            pairs[0] = _namesList[player1];
            pairs[1] = _namesList[player2];
            _pairings.Add(pairs);
            
            numberOfPlayers += 2;
        }

        foreach (string[] pair in _pairings)
        {
            Debug.Log($"{pair[0]} vs. {pair[1]}");
        }
    }
}
