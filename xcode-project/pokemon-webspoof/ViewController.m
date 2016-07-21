//
//  ViewController.m
//  pokemon-webspoof
//
//  Created by iam4x on 15/07/2016.
//  Copyright © 2016 iam4x. All rights reserved.
//

#import "ViewController.h"
#import "AVFoundation/AVFoundation.h"
#import "AudioToolbox/AudioToolbox.h"


@interface ViewController () <AVAudioPlayerDelegate> {
    
    AVAudioPlayer *backgroundAudioPlayer; //Plays silent audio in the background to keep
}

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSURL *url = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"silent" ofType:@"mp3"]];
    backgroundAudioPlayer=[backgroundAudioPlayer initWithContentsOfURL:url error:nil];
    backgroundAudioPlayer.numberOfLoops=-1;
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionMixWithOthers error:nil]; //Allows the silent audio to play along side iTunes
    [[AVAudioSession sharedInstance] setActive:YES error:nil];
    
    [backgroundAudioPlayer play];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)launchPokemonGo:(id)sender {
    
    if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"b335b2fc-69dc-472c-9e88-e6c97f84091c-3://"]]) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"b335b2fc-69dc-472c-9e88-e6c97f84091c-3://"]];
    }
    
}

- (IBAction)backgroundAppSwitchChanged:(id)sender {
    
    if ([(UISwitch*)sender isOn]) {
        [backgroundAudioPlayer play];
    }
    else{
        [backgroundAudioPlayer stop];
    }
}
@end
