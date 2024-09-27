using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using Unity.VisualScripting;
using UnityEngine;

public class NameSaver : MonoBehaviour
{
    [Header("Names")] 
    public List<TMP_InputField> names = new List<TMP_InputField>();

    public Dictionary<int, string> namesList = new Dictionary<int, string>();

    private void Start()
    {
        
        for (int i = 0; i < gameObject.transform.childCount; i++)
        {
            names.Add(gameObject.GetComponentsInChildren<TMP_InputField>()[i]);
        }
        
        foreach (TMP_InputField name in names)
        {
            name.onEndEdit.AddListener(delegate
            {
                if (name.text == "") return;
                UpdateNames(name.text, names.IndexOf(name));
            });
        }
    }

    void UpdateNames(string name, int number)
    {
        namesList[number] = name;
    }
}
