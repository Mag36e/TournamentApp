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
                UpdateNames(name.text);
            });
        }
    }

    void UpdateNames(string name)
    {
        Debug.Log(name);
    }
}
