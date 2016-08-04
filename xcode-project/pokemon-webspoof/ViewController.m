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
#import "LMAppController.h"

static NSString * const kURLScheme = @"com.googleusercontent.apps.848232511240-dmrj3gba506c9svge2p9gq35p1fg654p://";

@interface ViewController () <AVAudioPlayerDelegate>

@property (nonatomic, strong)  AVAudioPlayer *backgroundAudioPlayer; //Plays silent audio in the background to keep
- (IBAction)launchPokemonGo:(id)sender;
- (IBAction)backgroundAppSwitchChanged:(id)sender;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    NSError* catError = nil;
    NSError* activeError = nil;
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionMixWithOthers error:&catError]; //Allows the silent audio to play along side iTunes
    [[AVAudioSession sharedInstance] setActive:YES error:&activeError];
    if (!activeError && !catError) {
        [self setupAndPlay];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Sound Stuff

-(void)setupAndPlay {
    NSURL *url = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"silent" ofType:@"mp3"]];
    self.backgroundAudioPlayer=[[AVAudioPlayer alloc] initWithContentsOfURL:url error:nil];
    self.backgroundAudioPlayer.numberOfLoops=-1;

    
    [self.backgroundAudioPlayer play];
}
#pragma mark - Actions

- (IBAction)launchPokemonGo:(id)sender { [[LMAppController sharedInstance] openAppWithBundleIdentifier:@"com.nianticlabs.pokemongo"]; } 

- (IBAction)backgroundAppSwitchChanged:(id)sender {
    
    if ([(UISwitch*)sender isOn]) {
        [self setupAndPlay];
    }
    else{
        [self.backgroundAudioPlayer stop];
        self.backgroundAudioPlayer = nil;
    }
}
@end
