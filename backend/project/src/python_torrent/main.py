# import libtorrent as lt
# import sys
# import time
# import os

# def download_torrent(magnet_link):
#     # Create a session
#     sess = lt.session()

#     # Add more trackers manually to increase chances of finding peers
#     trackers = [
#         "udp://tracker.coppersurfer.tk:6969/announce",
#         "udp://9.rarbg.to:2710/announce",
#         "udp://tracker.opentrackr.org:1337/announce",
#         "udp://tracker.leechers-paradise.org:6969/announce",
#         "udp://tracker.open-internet.nl:6969/announce",
#         "udp://open.demonii.si:1337/announce",
#         "udp://tracker.pirateparty.gr:6969/announce",
#         "udp://denis.stalker.upeer.me:6969/announce",
#         "udp://p4p.arenabg.com:1337/announce",
#         "udp://exodus.desync.com:6969/announce"
#     ]

#     # Parse the magnet link
#     params = lt.parse_magnet_uri(magnet_link)
#     params.save_path = "/media/debi/New Volume/Movie"  # Set your desired download directory
#     params.storage_mode = lt.storage_mode_t.storage_mode_sparse
#     params.trackers = trackers  # Manually add trackers

#     # Ensure the save path exists
#     if not os.path.exists(params.save_path):
#         os.makedirs(params.save_path)

#     # Add the torrent to the session
#     handle = sess.add_torrent(params)
#     print("Downloading:", handle.name())

#  # Get the number of pieces in the torrent
#     num_pieces = handle.torrent_file().num_pieces()
#     for i in range(num_pieces):
#         handle.piece_priority(i, 1)
#     # Monitor the download progress
#     start_time = time.time()
#     while True:
#         status = handle.status()

#         # If the torrent is seeding, the download is complete
#         if status.state == lt.torrent_status.seeding:
#             print("\nDownload complete!")
#             break

#         # Check if the download progress is stalled
#         elapsed_time = time.time() - start_time
#         if status.progress == 0 and elapsed_time > 60:  # Timeout if no progress in 1 minute
#             print("Download is stuck. No peers found!")
#             break

#         # Print current progress
#         print(f"\rProgress: {status.progress * 100:.2f}% | "
#               f"Download rate: {status.download_rate / 1000:.2f} kB/s | "
#               f"Upload rate: {status.upload_rate / 1000:.2f} kB/s | "
#               f"Peers: {status.num_peers}", end='', flush=True)

#         time.sleep(1)

#     print("Download complete!")



# # Example usage
# if __name__ == "__main__":
#     magnet_link = sys.argv[1]
#     download_torrent(magnet_link)
    


import libtorrent as lt
import sys
import time
import os

def download_torrent(magnet_link):
    # Create a session
    sess = lt.session()


    # Parse the magnet link
    params = lt.parse_magnet_uri(magnet_link)
    params.save_path ="/media/debi/New Volume/Movie"  # Set your desired download directory
    params.storage_mode = lt.storage_mode_t.storage_mode_sparse
     
    
    # Ensure the save path exists
    if not os.path.exists(params.save_path):
        os.makedirs(params.save_path)

    # Add the torrent to the session
    handle = sess.add_torrent(params)
    print("Downloading:", handle.name())

    handle.set_sequential_download(True)

    # Monitor the download progress
    while True:
        status = handle.status()
        if status.state == lt.torrent_status.seeding:
            print("\nDownload complete!")
            break

        status = handle.status()
        print(f"\rProgress: {status.progress * 100:.2f}% | "
              f"Download rate: {status.download_rate / 1000:.2f} kB/s | "
              f"Upload rate: {status.upload_rate / 1000:.2f} kB/s | "
              f"Peers: {status.num_peers}",end='', flush=True)
        time.sleep(1)

    print("Download complete!")

# Example usage
if __name__ == "__main__":
    magnet_link = sys.argv[1]
    download_torrent(magnet_link)


# status.pieces()
# handle.piece_priority   
# status.get_download_queue()
# status.download_rate()
# status.upload_rate()
