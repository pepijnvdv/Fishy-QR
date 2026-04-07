/*
 * FishReceiver.cs
 * ─────────────────────────────────────────────────────────────────────────────
 * Connects to the Node.js server via WebSocket and relays incoming fish images
 * (+ daily challenge data) to FishSpawner on the Unity main thread.
 *
 * SETUP:
 *  1. Install NativeWebSocket:
 *     Window → Package Manager → + → "Add package from git URL…"
 *     → https://github.com/endel/NativeWebSocket.git#upm
 *  2. Drop this script + FishSpawner + FishSwimmer into Assets/Scripts/
 *  3. Add a GameObject "FishManager" to the scene, attach FishReceiver & FishSpawner
 *  4. Set "Server Url" to ws://<your-PC-IP>:3000  (e.g. ws://192.168.1.10:3000)
 *  5. Press Play.
 */

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using NativeWebSocket;

[RequireComponent(typeof(FishSpawner))]
public class FishReceiver : MonoBehaviour
{
    [Header("Server")]
    [Tooltip("WebSocket URL of the Node.js server, e.g. ws://192.168.1.10:3000")]
    public string serverUrl = "ws://localhost:3000";

    [Tooltip("Seconds between reconnect attempts")]
    public float reconnectDelay = 3f;

    // ── Pending fish queue (thread-safe) ──────────────────
    private readonly Queue<FishPayload> _pendingFish = new Queue<FishPayload>();
    private readonly object _lock = new object();

    private WebSocket _ws;
    private FishSpawner _spawner;
    private bool _quitting;

    private void Awake()
    {
        _spawner = GetComponent<FishSpawner>();
    }

    private void Start()
    {
        StartCoroutine(ConnectLoop());
    }

    private IEnumerator ConnectLoop()
    {
        while (!_quitting)
        {
            yield return StartCoroutine(Connect());
            if (!_quitting)
            {
                Debug.Log($"[FishReceiver] Reconnecting in {reconnectDelay}s…");
                yield return new WaitForSeconds(reconnectDelay);
            }
        }
    }

    private IEnumerator Connect()
    {
        Debug.Log($"[FishReceiver] Connecting to {serverUrl}…");
        _ws = new WebSocket(serverUrl);

        _ws.OnOpen    += () => Debug.Log("[FishReceiver] ✅ Connected to server");
        _ws.OnError   += (e) => Debug.LogWarning($"[FishReceiver] ⚠️ Error: {e}");
        _ws.OnClose   += (e) => Debug.Log($"[FishReceiver] Connection closed: {e}");

        _ws.OnMessage += (bytes) =>
        {
            try
            {
                string json = System.Text.Encoding.UTF8.GetString(bytes);
                var msg     = JsonUtility.FromJson<ServerMessage>(json);

                if (msg.type == "fish" && !string.IsNullOrEmpty(msg.imageData))
                {
                    lock (_lock)
                    {
                        _pendingFish.Enqueue(new FishPayload
                        {
                            imageData            = msg.imageData,
                            challengeTitle       = msg.challengeTitle,
                            challengeEmoji       = msg.challengeEmoji,
                            challengeDescription = msg.challengeDescription,
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[FishReceiver] Parse error: {ex.Message}");
            }
        };

        yield return _ws.Connect(); // NativeWebSocket coroutine – waits until closed
    }

    private void Update()
    {
        // Must be called every frame for NativeWebSocket to dispatch messages
#if !UNITY_WEBGL || UNITY_EDITOR
        _ws?.DispatchMessageQueue();
#endif

        // Drain the queue on the main thread
        lock (_lock)
        {
            while (_pendingFish.Count > 0)
            {
                var payload = _pendingFish.Dequeue();
                _spawner.SpawnFish(payload.imageData);
                _spawner.ShowChallenge(
                    payload.challengeTitle,
                    payload.challengeEmoji,
                    payload.challengeDescription
                );
            }
        }
    }

    private void OnApplicationQuit()
    {
        _quitting = true;
        _ws?.Close();
    }

    // ── Data types ────────────────────────────────────────

    /// <summary>Flat payload sent over WebSocket from Node server.</summary>
    [Serializable]
    private class ServerMessage
    {
        public string type;
        public string imageData;
        public string challengeTitle;
        public string challengeEmoji;
        public string challengeDescription;
    }

    /// <summary>Decoded payload queued for main-thread processing.</summary>
    private struct FishPayload
    {
        public string imageData;
        public string challengeTitle;
        public string challengeEmoji;
        public string challengeDescription;
    }
}
